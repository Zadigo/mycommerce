import { describe, it, expect } from 'vitest'
import { usePaymentIntentComposable } from '../../layers/base/app/composables/use/cart/stripe'

describe('Tests for usePaymentIntentComposable', () => {
  it('should load the composable without errors', () => {
    const { hasPaymentIntent, paymentIntent } = usePaymentIntentComposable()
    expect(hasPaymentIntent.value).toBe(false)
    expect(paymentIntent.value).toBeUndefined()
  })
})
