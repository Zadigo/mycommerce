import { client } from '@/plugins/axios'
import { useVueSession } from '@/plugins/vue-storages'
import { useCart } from '@/stores/cart'
import { CartUpdateAPIResponse, UserSelection } from '@/types/composables/cart'
import { Product } from '@/types/shop'
import { AxiosError } from 'axios'
import { getCurrentInstance, ref } from 'vue'

/**
 * The cart composable is a function that allows
 * the implementation of cart functionnalities all
 * around the application. It allows also to work
 * with both axios and pinia at the same time when
 * working with adding or removing items from the cart
 * using proxy functions
 */
export function useCartComposable () {
  const app = getCurrentInstance()
  const cartStore = useCart()

  const { instance } = useVueSession()

  const userSelection = ref<UserSelection>({
    id: null,
    size: null,
    quantity: 1,
    product: {},
    session_id: null
  })

  const showSizeSelectionWarning = ref<boolean>(false)
  const stockDetailsResponse = ref({})

  /**
   * This is a callback function that can be used
   * to get details on the current stock of a given
   * product in the database
   */
  // async function requestCheckStock (id: number) {
  //   try {
  //     id
  //     stockDetailsResponse.value = {}
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }
  
  /**
   * Function used to communicate to the backend
   * that a product was added to the cart
   */
  async function requestAddToCart(data: UserSelection) {
    try {
      const sessionId = instance.retrieve<string>("session_id");
      // By changing this, it updates in the underlying
      // proxy in the ref since data is that proxy
      userSelection.value.session_id = sessionId || null;

      const response = await client.post<CartUpdateAPIResponse>("cart/add", data);
      // await requestCheckStock();
      return response;
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        // Handle error
      }
      return false
    }
  }

  /**
   * Proxy function used for example on the product
   * page to communicate between the page and 
   * `requestAddToCart`. This requires a size
   * selection
   */
  async function addToCart(
    product: Product,
    callback: (data: CartUpdateAPIResponse) => void
  ) {
    try {
      if (userSelection.value.size === null && product.has_sizes) {
        showSizeSelectionWarning.value = true;
      } else {
        userSelection.value.product = product;
        
        // if the product does not have sizes
        // to choose from always use "Unique"
        // this is more for precautions here
        if (!product.has_sizes) {
          userSelection.value.size = 'Unique'
        }

        const response = await requestAddToCart(userSelection.value);

        if (response) {
          instance.create('cart_cache', response.data);
          cartStore.updateCart(response.data);
          callback.call(app, response.data);
        }
      }
    } catch {
      // Handle error
    }
  }

  /**
   * Adds a product to the customer's cart when the
   * the product size or other caracteristics are
   * available in a list (e.g. ProductsPage, CollectionsPage...) 
   */
  async function quickAddToCart(
    product: Product,
    size: string | number,
    callback: () => void
  ) {
    userSelection.value.size = size;
    userSelection.value.id = product.id;
    userSelection.value.product = product;
    await addToCart(product, callback);
  }

  async function deleteFromCart (product: Product) {
    try {
      cartStore.removeFromCart(product)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    userSelection,
    showSizeSelectionWarning,
    stockDetailsResponse,
    deleteFromCart,
    addToCart,
    quickAddToCart
  }
}