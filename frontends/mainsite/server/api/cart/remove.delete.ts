import { useFirebaseAdmin } from '#shared/server_firebase'
import { CART_COOKIE_NAME, CART_COLLECTION_NAME } from '#shared/cart'
import { createErrorTemplate } from '~~/shared/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ id: string }>(event)
  const cookie = getCookie(event, CART_COOKIE_NAME)
  
  if (!cookie) {
    return
  }

  try {
    const { db } = useFirebaseAdmin()
    const docRef = db.collection(CART_COLLECTION_NAME).doc(cookie)

    const docSnapshot = await docRef.get()

    if (docSnapshot.exists) {
      const existingItems: CartItem[] = docSnapshot.data()?.items || []
      const newItems = existingItems.filter((item: CartItem) => item.product.id !== body.id)

      await docRef.update({
        items: newItems,
        total: calculateTotal(newItems),
        numberOfItems: calculateNumberOfItems(newItems),
      })
    }

    return {
      sessionId: docRef.id
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
