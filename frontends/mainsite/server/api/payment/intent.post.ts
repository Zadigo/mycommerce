import { Arrayable, CartItem, PaymentIntentApiResponse } from '~/types'
import { createErrorTemplate } from '~/utils'

type IntentRequestBody = {
  sessionId: string
  total: number
  items: Arrayable<CartItem>
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<IntentRequestBody>(event)

    const responseData = await $fetch<PaymentIntentApiResponse>('/payments/intent', {
      baseURL: useRuntimeConfig().public.golangProdUrl,
      method: 'POST',
      body,
      onRequest({ options }) {
        options.headers.set('Accept', 'application/json')
        options.headers.set('Content-Type', 'application/json')
        options.headers.set('Origin', 'http://localhost:3000')
      },
      onRequestError({ error }) {
        console.log('Error creating payment intent:', error)
      }
    })

    setCookie(event, 'payment_intent', responseData.paymentIntentId || '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return responseData
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
