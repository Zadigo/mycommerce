import { createErrorTemplate } from '#shared/utils'
import { LIKE_COLLECTION_NAME, SESSION_COOKIE_NAME } from '#shared/cart'
import { useFirebaseAdmin } from '#shared/server_firebase'

export default defineEventHandler(async (event) => {
  try {
    const { db } = useFirebaseAdmin()
    const collectionRef = db.collection(LIKE_COLLECTION_NAME)
    const sessionId = getCookie(event, SESSION_COOKIE_NAME)

    if (typeof sessionId !== 'undefined') {
      const result = collectionRef.where('sessionId', '==', sessionId)
      const snapshot = await result.get()

      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        return doc?.data().items || []
      } else {
        return []
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Session ID is undefined',
      })
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
