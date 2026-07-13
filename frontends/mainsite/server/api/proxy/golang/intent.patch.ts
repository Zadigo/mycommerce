import { Arrayable, CartItem, Nullable, PaymentIntentApiResponse, ShipingInformation } from '~/types'
import { createErrorTemplate } from '~/utils'

type IntentRequestBody = {
  paymentIntentId: string
  session_id: string
  shipment: Nullable<ShipingInformation>
  total: Nullable<number>
  items: Arrayable<CartItem>
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<IntentRequestBody>(event)

    const paymentIntentId = getCookie(event, 'payment_intent')
    body.paymentIntentId = paymentIntentId || ''

    return await $fetch<PaymentIntentApiResponse>('/payments/update', {
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
