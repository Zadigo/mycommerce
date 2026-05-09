package tests

import (
	"testing"
	"time"

	"github.com/Zadigo/purchase/internal/backend/payment"
	"github.com/stretchr/testify/assert"
)

func TestStripePayment(t *testing.T) {
	client := payment.CreateStripeClient()

	t.Run("Should create intent", func(t *testing.T) {
		intent, err := client.CreateIntent(payment.CreatePaymentIntentRequest{
			Amount: 1214,
		})
		assert.NoError(t, err)
		assert.NotNil(t, intent)

		time.Sleep(2 * time.Second)

		t.Run("Should update intent", func(t *testing.T) {
			updatedIntent, err := client.UpdateIntent(payment.UpdatePaymentIntentRequest{
				PaymentIntentData: payment.PaymentIntentData{
					PaymentIntentID: intent.ID,
				},
				AddressLine: "123 Main St",
				City:        "Anytown",
				Country:     "US",
				PostalCode:  "12345",
				State:       "CA",
			})

			assert.NoError(t, err)
			assert.NotNil(t, updatedIntent)
		})

		time.Sleep(2 * time.Second)

		t.Run("Should process payment", func(t *testing.T) {
			_, err := client.CaptureIntent(payment.ProcessPaymentIntentRequest{
				PaymentIntentData: payment.PaymentIntentData{
					PaymentIntentID: intent.ID,
					CustomerID:      "",
				},
			})
			assert.NoError(t, err)
		})
	})
}
