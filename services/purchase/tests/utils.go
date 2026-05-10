package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"

	"github.com/Zadigo/purchase/internal/backend"
	"github.com/Zadigo/purchase/internal/backend/payment"
	"github.com/Zadigo/purchase/internal/handlers"
)

func GetRootDir() string {
	path, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	rootDir := strings.TrimSuffix(path, "/tests")
	return rootDir
}

func GetServerConfig() *backend.ServerConfig {
	serverConfig := backend.NewServerConfig(GetRootDir())
	serverConfig.SetConfig(nil)
	return serverConfig.(*backend.ServerConfig)
}

func CreatePaymentIntentRecorder() *httptest.ResponseRecorder {
	serverConfig := GetServerConfig()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.CreatePaymentIntentHandler(w, r, serverConfig)
	})

	reader := bytes.NewReader([]byte(`{"amount":1.5}`))
	request := httptest.NewRequest("POST", "/payment", reader)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)
	return recorder
}

func UpdatePaymentIntentRecorder() *httptest.ResponseRecorder {
	serverConfig := GetServerConfig()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.UpdatePaymentIntentHandler(w, r, serverConfig)
	})

	data, err := json.Marshal(&payment.UpdatePaymentIntentRequest{
		PaymentIntentData: payment.PaymentIntentData{
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

	if err != nil {
		panic(err)
	}

	reader := bytes.NewReader(data)

	// stringData := fmt.Sprintf(`{"customer": "%s", "paymentIntentId":"%s","addressLine": "1 rue de Paris","city": "Paris","postalCode": "75001"}`, os.Getenv("CUSTOMER_ID"), os.Getenv("PAYMENT_INTENT_ID"))
	// reader := bytes.NewReader([]byte(stringData))
	request := httptest.NewRequest("POST", "/payment", reader)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)
	return recorder
}

func CapturePaymentIntentRecorder() *httptest.ResponseRecorder {
	serverConfig := GetServerConfig()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.ProcessPaymentHandler(w, r, serverConfig)
	})

	data, err := json.Marshal(&payment.CapturePaymentIntentRequest{
		PaymentIntentData: payment.PaymentIntentData{
			PaymentIntentID: os.Getenv("PAYMENT_INTENT_ID"),
			CustomerID:      os.Getenv("CUSTOMER_ID"),
		},
	})

	if err != nil {
		panic(err)
	}

	reader := bytes.NewReader(data)

	request := httptest.NewRequest("POST", "/payment", reader)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)
	return recorder
}
