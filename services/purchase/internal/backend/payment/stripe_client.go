package payment

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/stripe/stripe-go/v85"
)

// PaymentInterface defines the methods that any
// payment client (e.g., Stripe, PayPal) must implement.
type StripeClient struct {
	Client *stripe.Client
}

func (s *StripeClient) RunCallbacks(intent *stripe.PaymentIntent, callbacks ...func(intent *stripe.PaymentIntent)) bool {
	for _, callback := range callbacks {
		go callback(intent)
	}
	return true
}

// CaptureIntent processes a payment for the given amount.
func (s *StripeClient) CaptureIntent(data ProcessPaymentIntentRequest) (*stripe.PaymentIntent, error) {
	intent, err := s.Client.V1PaymentIntents.Confirm(context.Background(), data.PaymentIntentID, &stripe.PaymentIntentConfirmParams{})
	return intent, err
}

// UpdateIntent updates an existing payment intent with new
// details like shipping information and metadata.
func (s *StripeClient) UpdateIntent(data UpdatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error) {
	intent, err := s.Client.V1PaymentIntents.Update(context.Background(), data.PaymentIntentID, &stripe.PaymentIntentUpdateParams{
		Customer:     stripe.String(data.CustomerID),
		ReceiptEmail: stripe.String(data.Email),
		Metadata: map[string]string{
			"orderId": "6735",
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
	})
	s.RunCallbacks(intent, callbacks...)
	return intent, err
}

func (s *StripeClient) CreateIntent(data CreatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error) {
	options := &stripe.PaymentIntentCreateParams{
		Amount:      stripe.Int64(int64(data.Amount * 100)), // Convert to cents
		Currency:    stripe.String(string(stripe.CurrencyUSD)),
		Description: stripe.String("Test Payment Intent"),
	}

	intent, err := s.Client.V1PaymentIntents.Create(context.Background(), options)
	if err != nil {
		log.Printf("❌ Failed to create payment intent: %v", err)
		return nil, err
	}
	s.RunCallbacks(intent, callbacks...)
	return intent, nil
}

func (s *StripeClient) RefundPayment(paymentID string) bool {
	// Dummy implementation, always returns true
	return true
}

func CreateStripeClient() PaymentInterface {
	key := os.Getenv("STRIPE_API_KEY")
	if key == "" {
		log.Print("❌ STRIPE_API_KEY environment variable is not set")
		return nil
	}
	client := stripe.NewClient(key)
	return &StripeClient{
		Client: client,
	}
}
