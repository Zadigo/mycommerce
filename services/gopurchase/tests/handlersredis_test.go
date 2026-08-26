package tests

import (
	"testing"

	"github.com/Zadigo/gopurchase/internal/handlers"
	"github.com/Zadigo/gopurchase/tests/utils"
	"github.com/stretchr/testify/assert"
	"github.com/stripe/stripe-go/v85"
)

func TestHandlersRedis(t *testing.T) {
	redisHandler := handlers.NewPaymentRedis(utils.CreateRedisClient())

	intent := &stripe.PaymentIntent{
		ID: "pi_123",
	}

	type testCase struct {
		name string
		test func(t *testing.T, redisHandler *handlers.PaymentRedis)
	}

	testCases := []testCase{
		{
			name: "Should create payment intent",
			test: func(t *testing.T, redisHandler *handlers.PaymentRedis) {
				err := redisHandler.SetPaymentIntent(intent)
				assert.NoError(t, err)
			},
		},
		{
			name: "Should get payment intent",
			test: func(t *testing.T, redisHandler *handlers.PaymentRedis) {
				retrievedIntent, err := redisHandler.GetPaymentIntent(intent.ID)
				assert.NoError(t, err)
				assert.Equal(t, intent.ID, retrievedIntent.ID)
			},
		},
		{
			name: "Should update payment intent",
			test: func(t *testing.T, redisHandler *handlers.PaymentRedis) {
				intent.Amount = 2000
				err := redisHandler.UpdatePaymentIntent(intent)
				assert.NoError(t, err)

				retrievedIntent, err := redisHandler.GetPaymentIntent(intent.ID)
				assert.NoError(t, err)
				assert.Equal(t, intent.Amount, retrievedIntent.Amount)
			},
		},
		{
			name: "Should mark payment intent as completed",
			test: func(t *testing.T, redisHandler *handlers.PaymentRedis) {
				t.Skip()
				err := redisHandler.MarkPaymentIntentAsCaptured(intent.ID)
				assert.NoError(t, err)

				retrievedIntent, err := redisHandler.GetPaymentIntent(intent.ID)
				assert.NoError(t, err)
				assert.Equal(t, true, retrievedIntent.Metadata["completed"])
			},
		},
		{
			name: "Should delete payment intent",
			test: func(t *testing.T, redisHandler *handlers.PaymentRedis) {
				t.Skip()
				err := redisHandler.DeletePaymentIntent(intent.ID)
				assert.NoError(t, err)

				retrievedIntent, err := redisHandler.GetPaymentIntent(intent.ID)
				assert.Error(t, err)
				assert.Nil(t, retrievedIntent)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			tc.test(t, redisHandler)
		})
	}
}
