import { SESSION_COLLECTION_NAME, SESSION_COOKIE_NAME } from '~~/shared/cart'
import { useFirebaseAdmin } from '#shared/server_firebase'
import { createErrorTemplate } from '#shared/utils'
import { SessionData } from '~~/shared/types/session'

export default defineEventHandler(async (event) => {
  try {
    const { db } = useFirebaseAdmin()
    const collectionRef = db.collection(SESSION_COLLECTION_NAME)
    const sessionId = getCookie(event, SESSION_COOKIE_NAME)

    if (typeof sessionId === 'undefined') {
      const docRef = await collectionRef.add({
        createdAt: new Date()
      })

      const data: SessionData = {
        language: {
          choice: 'en',
          selected: true
        },
        recommendations: [],
        searchHistory: []
      }

      await docRef.set({
        ...data,
        createdAt: new Date()
      })

      setCookie(event, SESSION_COOKIE_NAME, docRef.id, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      })

      return {
        sessionId: docRef.id,
      }
    } else {
      const template = createErrorTemplate(new Error('Session already exists'))
      throw createError(template)
    }
  } catch (error) {
    console.error('Error creating session:', error)
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
