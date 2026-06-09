package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/Zadigo/gopurchase/internal/handlers"
	"github.com/Zadigo/gopurchase/internal/models"
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
	apiHandlers := handlers.PaymentApi{}
	apiHandlers.LoadStripeClient()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiHandlers.CreateIntent(w, r)
	})

	requestData := handlers.CreatePaymentIntentRequest{
		SessionId: "1234",
		Total:     10,
		CartItemsData: handlers.CartItemsData{
			Items: models.CartItems{
				Items: []models.CartItem{
					{
						Size: models.SizeItem{
							Name:         "Small",
							Metric:       "cm",
							Active:       true,
							Availability: true,
							VariantPrice: 10,
						},
						Product: models.Product{
							Id:   "prod_123",
							Name: "Test Product",
							MainImage: models.ProductImage{
								Name:        "main_image.jpg",
								Variant:     "main",
								Thumbnail:   "https://example.com/thumbnail.jpg",
								IsMainImage: true,
								Original:    "https://example.com/original.jpg",
							},
							Price:     0,
							SalePrice: 0,
							UnitPrice: 10,
						},
						Total:    10,
						Quantity: 1,
					},
				},
			},
		},
	}

	data, _ := json.Marshal(&requestData)
	reader := bytes.NewReader(data)

	request := httptest.NewRequest("POST", "/payment", reader)
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, request)

	return recorder
}

func UpdatePaymentIntentRecorder(t *testing.T) *httptest.ResponseRecorder {
	apiHandlers := handlers.PaymentApi{}
	apiHandlers.LoadStripeClient()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiHandlers.UpdateIntent(w, r)
	})

	data, _ := json.Marshal(&handlers.UpdatePaymentIntentRequest{
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
	apiHandlers.LoadStripeClient()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiHandlers.CaptureIntent(w, r)
	})

	data, _ := json.Marshal(&handlers.CapturePaymentIntentRequest{
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
