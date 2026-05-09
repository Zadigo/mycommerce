package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Zadigo/purchase/internal/backend"
	"github.com/Zadigo/purchase/internal/backend/auth"
	"github.com/Zadigo/purchase/internal/backend/payment"
	"github.com/Zadigo/purchase/internal/backend/stock"
	"github.com/stripe/stripe-go/v85"
)

// CreatePaymentIntentHandler handles the creation of a payment intent.
func CreatePaymentIntentHandler(w http.ResponseWriter, r *http.Request, serverConfig backend.ServerConfigInterface) {
	data := payment.CreatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	syncWithDjango := func(intent *stripe.PaymentIntent) {}
	syncWithRedis := func(intent *stripe.PaymentIntent) {}

	client := serverConfig.GetPaymentClient()
	intent, err := client.CreateIntent(data, syncWithDjango, syncWithRedis)
	if err != nil {
		http.Error(w, "Failed to create payment intent", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent created successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

	w.WriteHeader(http.StatusOK)
}

// UpdatePaymentIntentHandler handles the updating of a payment intent. This should be called on the shipping for for example
// in order to update the shipping information of the payment intent.
func UpdatePaymentIntentHandler(w http.ResponseWriter, r *http.Request, serverConfig backend.ServerConfigInterface) {
	data := payment.UpdatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	syncWithDjango := func(intent *stripe.PaymentIntent) {}
	syncWithRedis := func(intent *stripe.PaymentIntent) {}

	client := serverConfig.GetPaymentClient()
	client.UpdateIntent(data, syncWithDjango, syncWithRedis)

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Payment intent updated successfully",
	})

	w.WriteHeader(http.StatusOK)
}

// ProcessPaymentHandler handles the entire payment process, including authentication, stock checking, payment processing, and post-payment tasks.
func ProcessPaymentHandler(w http.ResponseWriter, r *http.Request, serverConfig backend.ServerConfigInterface) {
	log.Printf("⚡️ Processing payment...")

	// 1. Check that the user is authenticated and has the necessary permissions to make a purchase
	auth := auth.NewAuthentication()
	response, err := auth.AuthenticateToken("token")
	if err != nil {
		http.Error(w, "Failed to authenticate user", http.StatusUnauthorized)
		return
	}
	if response.State == false {
		http.Error(w, "User is not authorized", http.StatusForbidden)
		return
	}
	// 2. Check the stock for the given product ID
	stockInstance := &stock.CheckStockResponse{}
	err = stockInstance.CheckStock([]string{"1234"})
	if err != nil {
		http.Error(w, "Failed to check stock", http.StatusInternalServerError)
		return
	}
	if stockInstance.State == false {
		http.Error(w, "Stock is not available", http.StatusConflict)
		return
	}
	// 3. If stock is available, proceed to payment
	paymentClient := serverConfig.GetPaymentClient()

	data := payment.ProcessPaymentIntentRequest{}
	err = json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	_, err = paymentClient.CaptureIntent(data)
	if err != nil {
		http.Error(w, "Failed to process payment", http.StatusInternalServerError)
		return
	}
	// 4. IF the payment is successful create a task that will create an order and update the stock
	go stockInstance.UpdateStock("1234", 10)

	shipment := &stock.ShipmentResponse{}
	go shipment.CreateShipment("orderID")
}
