import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore'
import type { MaybeType, ProductNode } from '~/types'

/**
 * Composable for working with likes on the product
 * on a single product page 
 * @param product - The product to handle likes for
 */
export async function useLikeComposable(product: MaybeType<ProductNode>, callback?: (actionName: 'like' | 'unlike') => void) {
  const { docRef, session } = useSession()
    
  const _product = toValue(product)
  const productId = useToNumber(isDefined(_product) ? _product.node.id : '')
  const likedProducts = computed(() => isDefined(session) ? session.value.likedProducts : [])
  
  const isLiked = useArrayIncludes(likedProducts, productId.value)
  const icon = computed(() => isLiked.value ? 'i-fa7-solid:heart' : 'i-fa7-regular:heart')
  
  async function like() {
    if (isDefined(_product)) {
      if (isDefined(docRef)) {
        if (isLiked.value) {
          await updateDoc(docRef, { likedProducts: arrayRemove(productId.value) })
        } else {
          await updateDoc(docRef, { likedProducts: arrayUnion(productId.value) })
        }
        
        // const uniqueIds = useArrayUnique(session.value.likedProducts)
        // await updateDoc(docRef, { likedProducts: toValue(uniqueIds) })

        if (callback) {
          callback(isLiked.value ? 'unlike' : 'like')
        }
      }
    }
  }

  return {
    isLiked,
    icon,
    like
  }
}

/**
 * A simple composable to handle modal state when a
 * route navigation is attempted
 * @param state 
 * @param routePath 
 */
export function useModalStateNavigation(state: Ref<boolean>) {
  if (import.meta.server) {
    return {
      routerLink: (_path: string) => {}
    }
  }
  
  const toggleState = useToggle(state)
  const router = useRouter()
  const toLocalePath = useLocalePath()

  function routerLink(path: string) {
    router.push(toLocalePath(path))
  }

  onBeforeRouteLeave((to, from, next) => {
    if (state.value) toggleState(false)
    next()
  })

  return {
    /**
     * Function to handle router link navigation
     * @param path The path to navigate to
     */
    routerLink
  }
}

export type GlobalStateModalNames = 'search' | 'language' | 'whatsApp' | 'cart' | 'login' | 'addedProduct' | 'editProduct'

export type GlobalStateModalRefs = {
  [key in GlobalStateModalNames]: Ref<boolean>
}

/**
 * Composable used to quickly manage the states of modals
 * that uses the global state for visibility
 */
export function useModalsState() {
  const showSearchModal = useState<boolean>('showSearchModal')
  const toggleShowSearchModal = useToggle(showSearchModal)

  const showLanguageModal = useState<boolean>('showLanguageModal')
  const toggleShowLanguageModal = useToggle(showLanguageModal)
  
  const showWhatsAppModal = useState<boolean>('showWhatsAppModal')
  const toggleShowWhatsAppModal = useToggle(showWhatsAppModal)
  
  const showCartDrawer = useState<boolean>('showCartDrawer')
  const toggleShowCartDrawer = useToggle(showCartDrawer)
  
  const showLoginDrawer = useState<boolean>('showLoginDrawer')
  const toggleShowLoginDrawer = useToggle(showLoginDrawer)
  
  const authenticatedCart = useState<boolean>('authenticatedCart')
  const toggleAuthenticatedCart = useToggle(authenticatedCart)

  const showAddedProductDrawer = useState<boolean>('showAddedProductDrawer')
  const toggleShowAddedProductDrawer = useToggle(showAddedProductDrawer)
  
  const showEditProductDrawer = useState<boolean>('showEditProductDrawer')
  const toggleShowEditProductDrawer = useToggle(showEditProductDrawer)

  function closeAllModals(callback?: ({ search, language, whatsApp, cart, login, addedProduct, editProduct }: GlobalStateModalRefs) => void) {
    const modalStates = [
      showSearchModal,
      showLanguageModal,
      showWhatsAppModal,
      showCartDrawer,
      showLoginDrawer,
      showAddedProductDrawer,
      showEditProductDrawer
    ]

    modalStates.forEach((modalState) => {
      if (modalState.value) {
        modalState.value = false
      }
    })

    if (callback) {
      callback({ search: showSearchModal, language: showLanguageModal, whatsApp: showWhatsAppModal, cart: showCartDrawer, login: showLoginDrawer, addedProduct: showAddedProductDrawer, editProduct: showEditProductDrawer })
    }
  }

  return {
    toggleShowSearchModal,
    toggleShowLanguageModal,
    toggleShowWhatsAppModal,
    toggleShowCartDrawer,
    toggleShowLoginDrawer,
    toggleAuthenticatedCart,
    toggleShowAddedProductDrawer,
    toggleShowEditProductDrawer,
    /**
     * Closes all modals
     * @param callback - Optional callback with the modal refs that can be to manipulate the state of other modals after closing all
     */
    closeAllModals
  }
}
