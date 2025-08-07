// TODO:: Rename to DefaultPaymentProviders
export type PaymentType = 'Stripe' | 'Klarna'

export interface NewIntentAPIResponse {
    intent: string | null
    client: string | null
    message: string
    customer_id?: string | null
    headers: Record<string, string>
}

export interface StripeTokenResponse {
    token: {
        id: string
        object: string,
        card: {
            id: string,
            object: string
            address_city: string | null
            address_country: string | null
            address_line1: string | null
            address_line1_check: string | null
            address_line2: string | null
            address_state: string | null
            address_zip: string,
            address_zip_check: string,
            brand: string,
            country: string,
            cvc_check: string,
            dynamic_last4: string | null
            exp_month: number,
            exp_year: number,
            funding: string,
            last4: string,
            name: string | null
            networks: {
                preferred: null
            },
            tokenization_method: string | null
            wallet: string | null
        },
        client_ip: string
        created: number
        livemode: boolean
        type: string
        used: boolean
    }
}
