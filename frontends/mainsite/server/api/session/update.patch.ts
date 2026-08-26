import { SESSION_COLLECTION_NAME, SESSION_COOKIE_NAME } from '~~/shared/cart'
import { useFirebaseAdmin } from '#shared/server_firebase'
import { createErrorTemplate } from '#shared/utils'

export default defineEventHandler(async (_event) => {
  try {
    const { db } = useFirebaseAdmin()
    const collectionRef = db.collection(SESSION_COLLECTION_NAME)
    const sessionId = getCookie(_event, SESSION_COOKIE_NAME)

    if (typeof sessionId !== 'undefined') {
      const docRef = collectionRef.doc(sessionId)

      docRef.update({
        language: {
          choice: 'en',
          selected: true
        },
        updatedAt: new Date()
      })
    }

    return {
      state: 'Session updated successfully',
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
