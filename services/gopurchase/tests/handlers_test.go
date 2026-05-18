package tests

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestCreatePaymentIntentHandler(t *testing.T) {
	err := godotenv.Load()
	assert.NoError(t, err)

	t.Run("Should create payment intent", func(t *testing.T) {
		recorder := CreatePaymentIntentRecorder(t)
		assert.Equal(t, 200, recorder.Code)

		var responseData any
		err := json.NewDecoder(recorder.Body).Decode(&responseData)
		assert.NoError(t, err)
	})
}

func TestUpdatePaymentIntentHandler(t *testing.T) {
	err := godotenv.Load(".env")
	assert.NoError(t, err)

	t.Run("Should update payment intent", func(t *testing.T) {
		recorder := UpdatePaymentIntentRecorder(t)
		assert.Equal(t, 200, recorder.Code)
		fmt.Print(recorder.Body)
	})
}

func TestCapturePaymentIntentHandler(t *testing.T) {
	err := godotenv.Load(".env")
	assert.NoError(t, err)

	t.Run("Should capture payment intent", func(t *testing.T) {
		recorder := CapturePaymentIntentRecorder(t)
		assert.Equal(t, 200, recorder.Code, recorder.Body.String())
		fmt.Print(recorder.Body)
	})
}
