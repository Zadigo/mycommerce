import { useFirebaseAdmin } from '#shared/server_firebase'
import { CART_COOKIE_NAME, CART_COLLECTION_NAME } from '#shared/cart'
import { createErrorTemplate } from '~~/shared/utils'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, CART_COOKIE_NAME)

  if (!cookie) {
    const template = createErrorTemplate(new Error('Cart cookie not found'))
    throw createError(template)
  }

  try {
    const { db } = useFirebaseAdmin()
    const docRef = db.collection(CART_COLLECTION_NAME).doc(cookie)

    const docSnapshot = await docRef.get()

    if (docSnapshot.exists) {
      await docRef.update({
        items: []
      })
    }

    await docRef.update({
      items: [],
      total: 0,
      numberOfItems: 0
    })

    return {
      sessionId: docRef.id
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
