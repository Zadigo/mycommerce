import type { Nullable } from '~/types'

// TODO:: Rename to DefaultPaymentProviders
export type PaymentType = 'Stripe' | 'Klarna'

export interface NewIntentAPIResponse {
  intent: Nullable<string>
  client: Nullable<string>
  message: string
  customer_id: Nullable<string>
  headers: Record<string, string>
}

export interface StripeTokenResponse {
  token: {
    id: string
    object: string
    card: {
      id: string
      object: string
      address_city: Nullable<string>
      address_country: Nullable<string>
      address_line1: Nullable<string>
      address_line1_check: Nullable<string>
      address_line2: Nullable<string>
      address_state: Nullable<string>
      address_zip: string
      address_zip_check: string
      brand: string
      country: string
      cvc_check: string
      dynamic_last4: Nullable<string>
      exp_month: number
      exp_year: number
      funding: string
      last4: string
      name: Nullable<string>
      networks: {
        preferred: null
      }
      tokenization_method: Nullable<string>
      wallet: Nullable<string>
    }
    client_ip: string
    created: number
    livemode: boolean
    type: string
    used: boolean
  }
}
