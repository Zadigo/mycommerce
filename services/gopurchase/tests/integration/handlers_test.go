package integration

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/Zadigo/gopurchase/tests/utils"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type PaymentIntentSuite struct {
	suite.Suite
}

func (suite *PaymentIntentSuite) TestPaymentIntegration() {
	err := godotenv.Load()
	assert.NoError(suite.T(), err)

	suite.T().Run("Should create payment intent", func(t *testing.T) {
		recorder := utils.CreatePaymentIntentRecorder(suite.T())
		assert.Equal(t, 200, recorder.Code)

		var responseData any
		err := json.NewDecoder(recorder.Body).Decode(&responseData)
		assert.NoError(t, err)

		t.Run("Should update payment intent", func(t *testing.T) {
			recorder := utils.UpdatePaymentIntentRecorder(t)
			assert.Equal(t, 200, recorder.Code)
			fmt.Print(recorder.Body)
		})

		t.Run("Should capture payment intent", func(t *testing.T) {
			recorder := utils.CapturePaymentIntentRecorder(t)
			assert.Equal(t, 200, recorder.Code, recorder.Body.String())
			fmt.Print(recorder.Body)
		})
	})
}

func TestPaymentIntentSuite(t *testing.T) {
	suite.Run(t, new(PaymentIntentSuite))
}
