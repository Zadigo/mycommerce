package handlers

import (
	"context"

	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/stripe/stripe-go/v85"
)

type PaymentIntentData struct {
	// The ID of the payment intent in Stripe. This is required to
	// update or capture the payment intent.
	PaymentIntentID string `json:"paymentIntentId"`
	// Stripe customer ID. This is optional and can be used to link the payment intent
	// to an existing customer in Stripe.
	CustomerID string `json:"customer_id,omitempty"`
}

type CartItemsData struct {
	// The items in the customer's cart. This is used to create line items in
	// the payment intent and to provide detailed information about the purchase
	// in the payment intent metadata.
	Items models.CartItems `json:"items"`
}

type ShipmentInfo struct {
	Firstname   string `json:"first_name,omitempty"`
	Lastname    string `json:"last_name,omitempty"`
	AddressLine string `json:"address_line,omitempty"`
	City        string `json:"city,omitempty"`
	Country     string `json:"country,omitempty"`
	PostalCode  string `json:"postal_code,omitempty"`
	State       string `json:"state,omitempty"`
	Email       string `json:"email,omitempty"`
	Telephone   string `json:"telephone,omitempty"`
}

// UpdatePaymentIntentData represents the data
// required to update a payment intent.
type UpdatePaymentIntentRequest struct {
	PaymentIntentData
	CartItemsData
	Shipment ShipmentInfo `json:"shipment"`
	Total    float64      `json:"total"`
}

// CapturePaymentIntentRequest represents the data required to
// capture a payment intent.
type CapturePaymentIntentRequest struct {
	PaymentIntentData
	Card      string `json:"card"`
	SessionID string `json:"session_id"`
	ClientIp  string `json:"client_ip"`
	Token     string `json:"token"`
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
	App           models.AppInterface
	Ctx           context.Context
}
