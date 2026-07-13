import { PaymentIntentApiResponse } from '~/types'
import { createErrorTemplate } from '~/utils'

type IntentRequestBody = {
  paymentIntentId: string
  customer_id: string
  card: string
  session_id: string
  client_ip: string
  token: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<IntentRequestBody>(event)

    const paymentIntentId = getCookie(event, 'payment_intent')
    body.paymentIntentId = paymentIntentId || ''

    return await $fetch<PaymentIntentApiResponse>('/payments/capture', {
      baseURL: useRuntimeConfig().public.golangProdUrl,
      method: 'POST',
      body,
      onRequest({ options }) {
        options.headers.set('Accept', 'application/json')
        options.headers.set('Content-Type', 'application/json')
        options.headers.set('Origin', 'http://localhost:3000')
      },
      onRequestError({ error }) {
        console.log('Error updating payment intent:', error)
      }
    })
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
