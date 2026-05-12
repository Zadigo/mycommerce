package tests

import (
	"testing"
	"time"

	"github.com/Zadigo/purchase/internal/backend/payment"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestStripePayment(t *testing.T) {
	err := godotenv.Load()
	assert.NoError(t, err)

	client := payment.CreateStripeClient()
	assert.NotNil(t, client)

	t.Run("Should create intent", func(t *testing.T) {
		intent, err := client.CreateIntent(payment.CreatePaymentIntentRequest{
			SessionId: "test-session-id",
			Total:     8,
		})
		assert.NoError(t, err)
		assert.NotNil(t, intent)

		time.Sleep(2 * time.Second)

		t.Run("Should update intent", func(t *testing.T) {
			updatedIntent, err := client.UpdateIntent(payment.UpdatePaymentIntentRequest{
				PaymentIntentData: payment.PaymentIntentData{
					PaymentIntentID: intent.ID,
				},
				AddressLine: "10 Rue Meurein",
				City:        "Lille",
				Country:     "FR",
				PostalCode:  "59800",
				State:       "Hauts-de-France",
				Firstname:   "John",
				Lastname:    "Doe",
				Email:       "bevat30904@ellbit.com",
				Telephone:   "(508)956-4243",
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
