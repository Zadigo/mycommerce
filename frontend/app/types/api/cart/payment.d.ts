import type { Nullable } from '~/types'

export type DefaultPaymentProviders = 'Stripe' | 'Klarna'

export interface PaymentIntentApiResponse {
  intent: Nullable<string>
  client: Nullable<string>
  message: string
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

export interface EstimatedDeliveryDate {
	delivery_date: string
	minDelivery_date: string
	maxDelivery_date: string
}

// interface ShopRunbackValues {
// 	is_link_order_return_active: boolean
// 	order_return_type: {}
// 	order_return_link?: any
// 	order_return_number_of_day: number
// 	url: string
// }

type ShippingNames = 'Relais Colis'
  | 'Colipost Internet' 
  | 'Colipost DOMTOM'
  | 'En Magasin'
  | 'Inpost' 
  | 'Chronopost' 
  | 'Mondial Relay' 
  | 'DHL' 
  | 'UPS' 
  | 'GLS' 
  | 'La Poste'

export interface DeliveryOption {
	id: string
	name: ShippingNames
	description: string
	estimated_arrival_time?: any
	default: boolean
	shipping_cost: string
	selected: boolean
	is_relais: boolean
	is_home: boolean
	is_store: boolean
	is_inpost: boolean
	is_managed_by_kbrw: boolean
	is_cash_on_delivery: boolean
	is_tAH: boolean
  estimated_delivery_date: EstimatedDeliveryDate
	shipping_costValue: number
  // shop_runback_values: ShopRunbackValues
}

export interface ShipingInformation {
  address_line: string
  city: string
  zip_code: string
  country: string
  firstname: string
  lastname: string
  telephone: string
  email: string
}
