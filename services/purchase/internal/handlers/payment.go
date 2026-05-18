package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/Zadigo/purchase/internal/backend"
	"github.com/Zadigo/purchase/internal/backend/models"
	"github.com/Zadigo/purchase/internal/backend/payment"
	"github.com/stripe/stripe-go/v85"
)

// CreatePaymentIntentHandler handles the creation of a payment intent.
func CreatePaymentIntentHandler(w http.ResponseWriter, r *http.Request, serverConfig backend.ServerConfigInterface) {
	data := payment.CreatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	syncWithDjango := func(intent *stripe.PaymentIntent) {}
	syncWithRedis := func(intent *stripe.PaymentIntent) {}

	client := serverConfig.GetPaymentClient()
	intent, err := client.CreateIntent(data, syncWithDjango, syncWithRedis)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Failed to create payment intent", Message: err.Error()}
		JsonResponse(w, message, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent created successfully",
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}

// UpdatePaymentIntentHandler handles the updating of a payment intent. This should be called on the shipping for for example
// in order to update the shipping information of the payment intent.
func UpdatePaymentIntentHandler(w http.ResponseWriter, r *http.Request, serverConfig backend.ServerConfigInterface) {
	data := payment.UpdatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	if data.PaymentIntentData.PaymentIntentID == "" {
		message := DefaultErrorResponse{Detail: "Payment intent ID is required", Message: "Please provide a valid payment intent ID"}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	syncWithDjango := func(intent *stripe.PaymentIntent) {}
	syncWithRedis := func(intent *stripe.PaymentIntent) {}

	client := serverConfig.GetPaymentClient()
	intent, err := client.UpdateIntent(data, syncWithDjango, syncWithRedis)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Failed to update payment intent", Message: err.Error()}
		JsonResponse(w, message, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent updated successfully",
	})

	w.WriteHeader(http.StatusOK)
}

// ProcessPaymentHandler handles the entire payment process, including authentication, stock checking, payment processing, and post-payment tasks.
func ProcessPaymentHandler(w http.ResponseWriter, r *http.Request, serverConfig backend.ServerConfigInterface) {
	// 1. Check that the user is authenticated and has the necessary permissions to make a purchase
	// auth := auth.NewAuthentication()
	// response, err := auth.AuthenticateToken("token")
	// if err != nil {
	// 	message := DefaultErrorResponse{Detail: "Failed to authenticate user", Message: err.Error()}
	// 	JsonResponse(w, message, http.StatusUnauthorized)
	// 	return
	// }
	// if response.State == false {
	// 	message := DefaultErrorResponse{Detail: "User is not authorized", Message: "User does not have the necessary permissions"}
	// 	JsonResponse(w, message, http.StatusForbidden)
	// 	return
	// }

	// 2. Check the stock for the given product ID
	// stockInstance := &stock.CheckStockResponse{}
	// err := stockInstance.CheckStock([]string{"1234"})
	// if err != nil {
	// 	message := DefaultErrorResponse{Detail: "Failed to check stock", Message: err.Error()}
	// 	JsonResponse(w, message, http.StatusInternalServerError)
	// 	return
	// }
	// if stockInstance.State == false {
	// 	message := DefaultErrorResponse{Detail: "Stock is not available", Message: "The requested product is out of stock"}
	// 	JsonResponse(w, message, http.StatusConflict)
	// 	return
	// }

	// 3. If stock is available, proceed to payment
	paymentClient := serverConfig.GetPaymentClient()

	data := payment.ProcessPaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	_, err = paymentClient.CaptureIntent(data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Failed to process payment", Message: err.Error()}
		JsonResponse(w, message, http.StatusInternalServerError)
		return
	}

	// 4. IF the payment is successful create a task that will create an order and update the stock
	// go stockInstance.UpdateStock("1234", 10)

	// shipment := &stock.ShipmentResponse{}
	// go shipment.CreateShipment("orderID")
}

func PingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	responseData := bytes.NewBuffer([]byte(`{"message": "pong"}`))
	w.Write(responseData.Bytes())
}

type PaymentApi struct {
	PaymentClient *stripe.Client
	ServerConfig  models.ServerConfigInterface
	Ctx           context.Context
}

func (p *PaymentApi) LoadClient() error {
	key := os.Getenv("STRIPE_API_KEY")
	if key == "" {
		return fmt.Errorf("STRIPE_API_KEY environment variable is not set")
	}
	p.PaymentClient = stripe.NewClient(key)
	return nil
}

func (p *PaymentApi) CreateIntent(w http.ResponseWriter, r *http.Request) {
	data := payment.CreatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	params := &stripe.PaymentIntentUpdateParams{
		ReceiptEmail: stripe.String(data.Email),
		AmountDetails: &stripe.PaymentIntentUpdateAmountDetailsParams{
			LineItems: data.Items.UpdateLineItems(),
		},
		Shipping: &stripe.ShippingDetailsParams{
			Name:  stripe.String(fmt.Sprintf("%s %s", data.Firstname, data.Lastname)),
			Phone: stripe.String(data.Telephone),
			Address: &stripe.AddressParams{
				City:       stripe.String(data.City),
				Country:    stripe.String(data.Country),
				Line1:      stripe.String(data.AddressLine),
				Line2:      stripe.String(""),
				PostalCode: stripe.String(data.PostalCode),
				State:      stripe.String(data.State),
			},
		},
	}

	if data.CustomerID != "" {
		params.Customer = stripe.String(data.CustomerID)
	}

	intent, err := a.PaymentClient.V1PaymentIntents.Update(p.Ctx, data.PaymentIntentID, params)

	// client := serverConfig.GetPaymentClient()
	// intent, err := client.CreateIntent(data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Failed to create payment intent", Message: err.Error()}
		JsonResponse(w, message, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent created successfully",
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}

func (p *PaymentApi) UpdateIntent(w http.ResponseWriter, r *http.Request) {
	data := payment.UpdatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	if data.PaymentIntentData.PaymentIntentID == "" {
		message := DefaultErrorResponse{Detail: "Payment intent ID is required", Message: "Please provide a valid payment intent ID"}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	params := &stripe.PaymentIntentUpdateParams{
		ReceiptEmail: stripe.String(data.Email),
		AmountDetails: &stripe.PaymentIntentUpdateAmountDetailsParams{
			LineItems: data.Items.UpdateLineItems(),
		},
		Shipping: &stripe.ShippingDetailsParams{
			Name:  stripe.String(fmt.Sprintf("%s %s", data.Firstname, data.Lastname)),
			Phone: stripe.String(data.Telephone),
			Address: &stripe.AddressParams{
				City:       stripe.String(data.City),
				Country:    stripe.String(data.Country),
				Line1:      stripe.String(data.AddressLine),
				Line2:      stripe.String(""),
				PostalCode: stripe.String(data.PostalCode),
				State:      stripe.String(data.State),
			},
		},
	}

	if data.CustomerID != "" {
		params.Customer = stripe.String(data.CustomerID)
	}

	intent, err := p.PaymentClient.V1PaymentIntents.Update(p.Ctx, data.PaymentIntentID, params)
}

func (p *PaymentApi) CaptureIntent(w http.ResponseWriter, r *http.Request) {
	intent, err := p.PaymentClient.V1PaymentIntents.Confirm(p.Ctx, data.PaymentIntentID, &stripe.PaymentIntentConfirmParams{
		ReturnURL:     stripe.String("https://example.com/return_url"),
		PaymentMethod: stripe.String("pm_card_mastercard"),
	})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
