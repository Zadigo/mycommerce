package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/Zadigo/purchase/internal/handlers"
	"github.com/stretchr/testify/assert"
)

func GetRootDir() string {
	path, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	rootDir := strings.TrimSuffix(path, "/tests")
	return rootDir
}

func CreatePaymentIntentRecorder(t *testing.T) *httptest.ResponseRecorder {
	handlers := handlers.PaymentApi{}
	err := handlers.LoadStripeClient()
	assert.NotNil(t, err)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.CaptureIntent(w, r)
	})

	reader := bytes.NewReader([]byte(`{"amount":1.5}`))
	request := httptest.NewRequest("POST", "/payment", reader)
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, request)
	return recorder
}

func UpdatePaymentIntentRecorder(t *testing.T) *httptest.ResponseRecorder {
	apiHandlers := handlers.PaymentApi{}
	err := apiHandlers.LoadStripeClient()
	assert.NotNil(t, err)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiHandlers.UpdateIntent(w, r)
	})

	data, err := json.Marshal(&handlers.UpdatePaymentIntentRequest{
		PaymentIntentData: handlers.PaymentIntentData{
			PaymentIntentID: os.Getenv("PAYMENT_INTENT_ID"),
			CustomerID:      os.Getenv("CUSTOMER_ID"),
		},
		Firstname:   "John",
		Lastname:    "Doe",
		AddressLine: "1 rue de Paris",
		Country:     "FR",
		PostalCode:  "75001",
		City:        "Paris",
		State:       "Île-de-France",
		Email:       "test@example.com",
		Telephone:   "+330612345678",
	})

	reader := bytes.NewReader(data)
	request := httptest.NewRequest("POST", "/payment", reader)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)
	return recorder
}

func CapturePaymentIntentRecorder(t *testing.T) *httptest.ResponseRecorder {
	apiHandlers := handlers.PaymentApi{}
	err := apiHandlers.LoadStripeClient()
	assert.NotNil(t, err)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiHandlers.CaptureIntent(w, r)
	})

	data, err := json.Marshal(&handlers.CapturePaymentIntentRequest{
		PaymentIntentData: handlers.PaymentIntentData{
			PaymentIntentID: os.Getenv("PAYMENT_INTENT_ID"),
			CustomerID:      os.Getenv("CUSTOMER_ID"),
		},
	})

	reader := bytes.NewReader(data)

	request := httptest.NewRequest("POST", "/payment", reader)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)
	return recorder
}
