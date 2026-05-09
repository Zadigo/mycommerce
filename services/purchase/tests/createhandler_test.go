package tests

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/Zadigo/purchase/internal/backend/payment"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestCreatePaymentIntentHandler(t *testing.T) {
	err := godotenv.Load()
	assert.NoError(t, err)

	t.Run("Should create payment intent", func(t *testing.T) {
		recorder := CreatePaymentIntentRecorder()
		assert.Equal(t, 200, recorder.Code)

		err := json.NewDecoder(recorder.Body).Decode(&payment.CreatePaymentIntentRequest{})
		assert.NoError(t, err)
	})
}

func TestUpdatePaymentIntentHandler(t *testing.T) {
	err := godotenv.Load()
	assert.NoError(t, err)

	t.Run("Should update payment intent", func(t *testing.T) {
		recorder := UpdatePaymentIntentRecorder()
		assert.Equal(t, 200, recorder.Code)
		fmt.Print(recorder.Body)
	})
}
