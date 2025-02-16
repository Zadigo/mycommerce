import { defineEventHandler } from 'h3'
import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (e) => {
    
    try {
        let paymentIntent
        const stripe = await useServerStripe(e)
        
        paymentIntent = await stripe.paymentIntents.create({
            currency: 'eur',
            amount: 10,
            automatic_payment_methods: { enabled: true },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            error: null,
        };
    } catch (e) {
        console.error(e)
        return {
            clientSecret: null,
            error: e
        };
    }
})
