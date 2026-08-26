import { useFirebaseAdmin } from '#shared/server_firebase'
import { CartSessionData } from '#shared/types/cart'
import { CART_COOKIE_NAME, CART_COLLECTION_NAME } from '#shared/cart'
import { createErrorTemplate } from '~~/shared/utils'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, CART_COOKIE_NAME)

  if (typeof cookie === 'string' && typeof cookie !== 'undefined') {
    return {
      sessionId: cookie
    }
  }

  try {
    const { db } = useFirebaseAdmin()
    const docRef = db.collection(CART_COLLECTION_NAME).doc()
    
    const sessionData: CartSessionData = {
      sessionId: '12345',
      items: [],
      total: 0,
      numberOfItems: 0,
      paymentIntent: null,
      authenticated: false,
      viewCount: 0
    }
    
    await docRef.create({
      ...sessionData,
      createdAt: new Date().toISOString()
    })
  
    setCookie(event, CART_COOKIE_NAME, docRef.id, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      // domain: process.env.NODE_ENV === 'production' ? '.mycommerceclassic.com' : undefined,
      priority: 'high',   
    })
    
    return {
      sessionId: docRef.id
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
