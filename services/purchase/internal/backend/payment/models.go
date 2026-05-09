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
	CustomerID      string `json:"customerId"`
}

// UpdatePaymentIntentData represents the data
// required to update a payment intent.
type UpdatePaymentIntentRequest struct {
	PaymentIntentData
	Firstname   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	AddressLine string `json:"addressLine"`
	City        string `json:"city"`
	Country     string `json:"country"`
	PostalCode  string `json:"postalCode"`
	State       string `json:"state"`
	Email       string `json:"email"`
	Telephone   string `json:"telephone"`
}

type CreatePaymentIntentRequest struct {
	Amount int `json:"amount"`
}

type CapturePaymentIntentRequest struct {
	PaymentIntentData
}

type ProcessPaymentIntentRequest struct {
	PaymentIntentData
}
