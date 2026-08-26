import { useFirebaseAdmin } from '#shared/server_firebase'
import { CART_COOKIE_NAME, CART_COLLECTION_NAME } from '#shared/cart'
import { createErrorTemplate } from '~~/shared/utils'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, CART_COOKIE_NAME)
  if (!cookie) {
    return
  }

  try {
    const { db } = useFirebaseAdmin()
    const docRef = db.collection(CART_COLLECTION_NAME).doc()

    const docSnapshot = await docRef.get()

    if (docSnapshot.exists) {
      const items: CartItem[] = docSnapshot.data()?.items || []
      return items
    } else {
      return []
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
