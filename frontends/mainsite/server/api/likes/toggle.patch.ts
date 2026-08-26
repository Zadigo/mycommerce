import { useFirebaseAdmin } from '#shared/server_firebase'
import { createErrorTemplate } from '#shared/utils'
import { SESSION_COOKIE_NAME, LIKE_COLLECTION_NAME } from '#shared/cart'
import { FieldValue } from 'firebase-admin/firestore'
  
export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, SESSION_COOKIE_NAME)
    const body = await readBody<{ productId: number | undefined }>(event)

    if (typeof body.productId === 'undefined') {
      const template = createErrorTemplate(new Error('Product ID is undefined'))
      throw createError(template)
    }

    const { db } = useFirebaseAdmin()
    const collectionRef = db.collection(LIKE_COLLECTION_NAME)
    
    if (typeof sessionId !== 'undefined') {
      const result = collectionRef.where('sessionId', '==', sessionId)
      
      if ((await result.get()).empty) {
        await collectionRef.add({
          sessionId: sessionId,
          items: [body.productId],
        })
      } else {
        const result = collectionRef.where('sessionId', '==', sessionId)
        if (!(await result.get()).empty) {
          const docRef = (await result.get()).docs[0]?.ref
          const items = (await docRef?.get())?.data()?.items || []
          if (!items.includes(body.productId)) {
            await docRef?.update({
              items: FieldValue.arrayUnion(body.productId),
            })
          } else {
            await docRef?.update({
              items: FieldValue.arrayRemove(body.productId),
            })
          }
        }
        return {
          state: 'Product like status toggled successfully',
        }
      }
    } else {
      const template = createErrorTemplate(new Error('Session ID is undefined'))
      throw createError(template)
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
