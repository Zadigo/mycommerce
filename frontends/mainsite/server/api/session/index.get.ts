import { SESSION_COLLECTION_NAME, SESSION_COOKIE_NAME } from '~~/shared/cart'
import { useFirebaseAdmin } from '#shared/server_firebase'
import { createErrorTemplate } from '#shared/utils'

export default defineEventHandler(async (_event) => {
  try {
    const { db } = useFirebaseAdmin()
    const collectionRef = db.collection(SESSION_COLLECTION_NAME)
    const sessionId = getCookie(_event, SESSION_COOKIE_NAME)

    if (typeof sessionId !== 'undefined') {
      const docRef = await collectionRef.doc(sessionId).get()
      if (docRef.exists) {
        return docRef.data() as SessionData || {}
      } else {
        return {}
      }
    }
  } catch(error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
