package payment

import "github.com/stripe/stripe-go/v85"

type PaymentInterface interface {
	CaptureIntent(data ProcessPaymentIntentRequest) (*stripe.PaymentIntent, error)
	UpdateIntent(data UpdatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error)
	CreateIntent(data CreatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error)
	RefundPayment(paymentID string) bool
	RunCallbacks(intent *stripe.PaymentIntent, callbacks ...func(intent *stripe.PaymentIntent)) bool
}

type PaymentIntentData struct {
	PaymentIntentID string `json:"paymentIntentId"`
	CustomerID      string `json:"customerId,omitempty"`
}

// UpdatePaymentIntentData represents the data
// required to update a payment intent.
type UpdatePaymentIntentRequest struct {
	PaymentIntentData
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
	// The session ID is used to link the payment intent to the session in
	// the Django backend. This allows us to easily retrieve the payment intent
	// when the user returns from the payment page and update the order
	// status accordingly.
	SessionId string `json:"sessionId"`
	// The total amount to be charged to the customer. This should be calculated
	// in the Django backend and passed to the Golang service to create the payment intent.
	Total float64 `json:"total"`
}

type CapturePaymentIntentRequest struct {
	PaymentIntentData
}

type ProcessPaymentIntentRequest struct {
	PaymentIntentData
}
