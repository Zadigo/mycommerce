package stripe

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/stripe/stripe-go/v85"
)

type StripeClientInterface interface {
	CaptureIntent(data ProcessPaymentIntentRequest) (*stripe.PaymentIntent, error)
	UpdateIntent(data UpdatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error)
	CreateIntent(data CreatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error)
	RefundPayment(paymentID string) bool
	RunCallbacks(intent *stripe.PaymentIntent, callbacks ...func(intent *stripe.PaymentIntent)) bool
}

func (s *StripeClient) RunCallbacks(intent *stripe.PaymentIntent, callbacks ...func(intent *stripe.PaymentIntent)) bool {
	for _, callback := range callbacks {
		go callback(intent)
	}
	return true
}

// CaptureIntent processes a payment for the given amount.
func (s *StripeClient) CaptureIntent(data ProcessPaymentIntentRequest) (*stripe.PaymentIntent, error) {
	intent, err := s.Client.V1PaymentIntents.Confirm(context.Background(), data.PaymentIntentID, &stripe.PaymentIntentConfirmParams{
		ReturnURL:     stripe.String("https://example.com/return_url"),
		PaymentMethod: stripe.String("pm_card_mastercard"),
	})
	return intent, err
}

// UpdateIntent updates an existing payment intent with new details like shipping information and metadata.
func (s *StripeClient) UpdateIntent(data UpdatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error) {
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

	intent, err := s.Client.V1PaymentIntents.Update(context.Background(), data.PaymentIntentID, params)
	s.RunCallbacks(intent, callbacks...)
	return intent, err
}

func (s *StripeClient) CreateIntent(data CreatePaymentIntentRequest, callbacks ...func(intent *stripe.PaymentIntent)) (*stripe.PaymentIntent, error) {
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

func NewStripeClient() (StripeClientInterface, error) {
	if key := os.Getenv("STRIPE_API_KEY"); key == "" {
		return nil, fmt.Errorf("❌ STRIPE_API_KEY environment variable is not set")
	}
	client := stripe.NewClient(os.Getenv("STRIPE_API_KEY"))
	return &StripeClient{Client: client}, nil
}
