package stripe

import (
	"github.com/Zadigo/purchase/internal/backend/models"
	"github.com/stripe/stripe-go/v85"
)

// PaymentInterface defines the methods that any
// payment client (e.g., Stripe, PayPal) must implement.
type StripeClient struct {
	Client *stripe.Client
}

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

type ProcessPaymentIntentRequest struct {
	PaymentIntentData
	CartItemsData
}

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
