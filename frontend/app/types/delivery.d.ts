export interface DeliveryOption {
  id: string
  name: string
  description: string
  estimated_arrival_time: null
  default: boolean
  shipping_cost: string | number
  selected: boolean
  is_relais: boolean
  is_home: boolean
  is_store: boolean
  is_inpost: boolean
  is_managed_by_kbrw: boolean
  is_cash_on_delivery: boolean
  is_tAH: boolean
  estimated_delivery_date: {
    delivery_date: string
    minDelivery_date: string
    maxDelivery_date: string
  }
  shipping_cost_value: number
  shop_runback_values: {
    is_link_order_return_active: boolean
    order_return_type: {}
    order_return_link: string | null
    order_return_number_of_day: number
    url: string
  }
}
