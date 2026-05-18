package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Zadigo/purchase/internal/models"
	"github.com/stripe/stripe-go/v85"
)

type PaymentIntentData struct {
	// The ID of the payment intent in Stripe. This is required to
	// update or capture the payment intent.
	PaymentIntentID string `json:"paymentIntentId"`
	// Stripe customer ID. This is optional and can be used to link the payment intent
	// to an existing customer in Stripe.
	CustomerID string `json:"customerId,omitempty"`
}

type CartItemsData struct {
	// The items in the customer's cart. This is used to create line items in
	// the payment intent and to provide detailed information about the purchase
	// in the payment intent metadata.
	Items models.CartItems `json:"items"`
}

// UpdatePaymentIntentData represents the data
// required to update a payment intent.
type UpdatePaymentIntentRequest struct {
	PaymentIntentData
	CartItemsData
	Firstname   string `json:"firstname,omitempty"`
	Lastname    string `json:"lastname,omitempty"`
	AddressLine string `json:"addressLine,omitempty"`
	City        string `json:"city,omitempty"`
	Country     string `json:"country,omitempty"`
	PostalCode  string `json:"postalCode,omitempty"`
	State       string `json:"state,omitempty"`
	Email       string `json:"email,omitempty"`
	Telephone   string `json:"telephone,omitempty"`
}

type CapturePaymentIntentRequest struct {
	PaymentIntentData
	CartItemsData
}

type ProcessPaymentIntentRequest struct {
	PaymentIntentData
	CartItemsData
}

type CreatePaymentIntentRequest struct {
	CartItemsData
	// The session ID is used to link the payment intent to the session in
	// the Django backend. This allows us to easily retrieve the payment intent
	// when the user returns from the payment page and update the order
	// status accordingly.
	SessionId string `json:"sessionId"`
	// The total amount to be charged to the customer. This should be calculated
	// in the Django backend and passed to the Golang service to create the payment intent.
	Total float64 `json:"total"`
}

type PaymentApi struct {
	PaymentClient *stripe.Client
	ServerConfig  models.ServerConfigInterface
	Ctx           context.Context
}

func (p *PaymentApi) LoadStripeClient() error {
	key := os.Getenv("STRIPE_API_KEY")
	if key == "" {
		return fmt.Errorf("STRIPE_API_KEY environment variable is not set")
	}
	p.PaymentClient = stripe.NewClient(key)
	return nil
}

func (p *PaymentApi) CreateIntent(w http.ResponseWriter, r *http.Request) {
	// Try to get an active customer from the shop database. We should receeive
	// a customer ID that we can use to create the payment intent since Django
	// automatically creates a Stripe customer for each user that registers
	// on the platform. If a customer does not exist, we will be able to update
	// it later in the UpdateIntent method once the customer creates his account.
	// var customerID string

	// requestData, _ := json.Marshal(map[string]any{"email": "something@gmail.com"})
	// reader := bytes.NewReader(requestData)

	// responseData := map[string]any{"customerId": ""}
	// err := utilities.SendRequest("https://example.com/", reader, responseData)

	// if err != nil {
	// 	// Do something
	// } else {
	// 	if id, ok := responseData["customerId"].(string); ok {
	// 		customerID = id
	// 	}
	// }

	data := CreatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	options := &stripe.PaymentIntentCreateParams{
		// Customer:    stripe.String(customerID),
		// ReturnURL:   stripe.String("https://example.com/return_url"),
		// PaymentMethod: stripe.String("pm_card_visa"),
		Amount:           stripe.Int64(int64(data.Total * 100)), // Convert to cents
		Currency:         stripe.String(string(stripe.CurrencyEUR)),
		Description:      stripe.String("Test Payment Intent"),
		Metadata:         map[string]string{"sessionId": data.SessionId},
		SetupFutureUsage: stripe.String("off_session"),
		AmountDetails: &stripe.PaymentIntentCreateAmountDetailsParams{
			LineItems: data.Items.CreateLineItems(),
		},
		PaymentMethodTypes: []*string{
			stripe.String("card"),
		},
	}

	intent, err := p.PaymentClient.V1PaymentIntents.Create(p.Ctx, options)
	if err != nil {
		log.Printf("❌ Failed to create payment intent: %v", err)
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
	data := UpdatePaymentIntentRequest{}
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

	if err != nil {
		message := DefaultErrorResponse{Detail: "Failed to update payment intent", Message: err.Error()}
		JsonResponse(w, message, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent updated successfully",
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}

func (p *PaymentApi) CaptureIntent(w http.ResponseWriter, r *http.Request) {
	data := UpdatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	intent, err := p.PaymentClient.V1PaymentIntents.Confirm(p.Ctx, data.PaymentIntentID, &stripe.PaymentIntentConfirmParams{
		ReturnURL:     stripe.String("https://example.com/return_url"),
		PaymentMethod: stripe.String("pm_card_mastercard"),
	})

	if err != nil {
		message := DefaultErrorResponse{Detail: "Failed to capture payment intent", Message: err.Error()}
		JsonResponse(w, message, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent captured successfully",
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
