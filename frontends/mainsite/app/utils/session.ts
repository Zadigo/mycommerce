import { promiseTimeout } from '@vueuse/core'
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore'

/**
 * Composable for accessing cart items from Firestore.
 */
export function useWriteableDocument<T extends Record<string, unknown>>(documentName: string, sessionName: string, defaults?: T) {
  const fireStore = useFirestore()

  const sessionId = useCookie(sessionName, { default: () => 'ecommerce-default', sameSite: 'strict', secure: true, expires: undefined })
  
  callOnce(sessionName, async () => {
    if (sessionId.value === 'ecommerce-default') {
      const newDoc = await addDoc(collection(fireStore, documentName), defaults)
      await promiseTimeout(400)
      sessionId.value = newDoc.id
    } else {
      const docRef = doc(fireStore, documentName, sessionId.value)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, defaults || {})
      }
    }
  }, { mode: 'navigation'})

  const [ isSyncing, toggleSyncing ] = useToggle(false)
  const [ isInitialized, toggleInitialized ] = useToggle(false)

  if (!isDefined(sessionId)) {
    throw createError(new Error(`Session ID cookie for ${sessionName} is not defined.`))
    // throw new Error(`Session ID cookie for ${sessionName} is not defined.`)
  }

  // const docRef = doc(fireStore, documentName, sessionId.value)
  // const session = useDocument<T>(docRef)

  const docRef = computed(() => {
    if (!sessionId.value) return null
    return doc(fireStore, documentName, sessionId.value)
  })

  const session = computed(() => {
    if (!docRef.value) return null
    return useDocument<T>(docRef.value!)
  })

  // Check if session is defined
  whenever(() => isDefined(session.value?.value), () => {
    toggleInitialized(true)
  })

  /**
   * Writeable session
   */

  const writeableSession = ref<T>()

  // Observe when _session changes and update 
  // writeableSession accordingly
  watch(() => session.value?.value, (newValue) => {
    if (isDefined(newValue)) {
      writeableSession.value = newValue
    }
  })

  // Sync writeable session to Firestore when it changes
  watchDebounced(() => session.value?.value, async (newValues) => {
    if (!isDefined(docRef) || !isDefined(newValues)) return

    try {
      toggleSyncing(true)
      await setDoc(docRef.value!, newValues)
    } catch (error) {
      console.log('Error writing session data to Firestore:', error)
    } finally {
      toggleSyncing(false)
    }
  }, { deep: true, debounce: 900 })

  return {
    docRef,
    session,
    writeableSession,
    isSyncing,
    isInitialized
  }
}
