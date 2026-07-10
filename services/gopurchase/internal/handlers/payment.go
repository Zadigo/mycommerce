package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Zadigo/gopurchase/internal/utils"
	"github.com/stripe/stripe-go/v85"
)

// SetupStripeClient initializes the Stripe client with the API key
// from the environment variable.
func (p *PaymentApi) SetupStripeClient() error {
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

	errorHandler := NewHttpErrorHandler(w)

	data := CreatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		message := utils.DefaultErrorResponse{Detail: "Invalid request payload", Message: err.Error()}
		utils.JsonResponse(w, message, http.StatusBadRequest)
		return
	}

	// TODO: Session ID should be JWT token in order to be able to verify
	// its authenticity and prevent malicious users from creating payment intents
	// with random session IDs. The JWT token should contain the session ID and any other
	// relevant information that we might need to create the payment intent. We can then verify the
	// JWT token using a secret key and extract the session ID from it to create the payment intent.
	if data.SessionId == "" {
		errorHandler.InvalidSessionIdError(err)
		return
	}

	options := &stripe.PaymentIntentCreateParams{
		// Customer:    stripe.String(customerID),
		// ReturnURL:   stripe.String("https://example.com/return_url"),
		// PaymentMethod: stripe.String("pm_card_visa"),
		// Set a default amount of 0.50 EUR for creation. This will be overridden during
		// the cusomter's checkout process when the total amount is calculated.
		Amount:           stripe.Int64(0.50 * 100), // Convert to cents
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

	if data.Total > 0 {
		// Only set the amount if it's greater than 0 in order to avoid
		// raising an error from Stripe since the amount is required when
		// creating a payment intent.
		options.Amount = stripe.Int64(int64(data.Total * 100)) // Convert to cents
	}

	intent, err := p.PaymentClient.V1PaymentIntents.Create(p.Ctx, options)
	if err != nil {
		log.Printf("❌ Failed to create payment intent: %v", err)
		errorHandler.PaymentIntentCreationError(err)
		return
	}

	// Store the payment intent in Redis
	redisHandler := NewPaymentRedis(p.App.GetRedisClient())
	err = redisHandler.SetPaymentIntent(intent)
	if err != nil {
		log.Printf("❌ Failed to store payment intent in Redis: %v", err)
	}

	responseData := map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent created successfully",
	}

	utils.JsonResponse(w, responseData, http.StatusOK)
}

func (p *PaymentApi) UpdateIntent(w http.ResponseWriter, r *http.Request) {
	errorHandler := NewHttpErrorHandler(w)

	data := UpdatePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		errorHandler.InvalidBodyError(err)
		return
	}

	if data.PaymentIntentData.PaymentIntentID == "" {
		errorHandler.PaymentIntentMissingError(err)
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
		errorHandler.PaymentIntentUpdateError(err)
		return
	}

	redisHandler := NewPaymentRedis(p.App.GetRedisClient())
	err = redisHandler.UpdatePaymentIntent(intent)
	if err != nil {
		log.Printf("❌ Failed to update payment intent in Redis: %v", err)
	}

	responseData := map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent updated successfully",
	}

	utils.JsonResponse(w, responseData, http.StatusOK)
}

func (p *PaymentApi) CaptureIntent(w http.ResponseWriter, r *http.Request) {
	errorHandler := NewHttpErrorHandler(w)

	data := CapturePaymentIntentRequest{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		errorHandler.InvalidBodyError(err)
		return
	}

	intent, err := p.PaymentClient.V1PaymentIntents.Confirm(p.Ctx, data.PaymentIntentID, &stripe.PaymentIntentConfirmParams{
		ReturnURL:     stripe.String("https://example.com/return_url"),
		// PaymentMethod: stripe.String("pm_card_mastercard"),
		PaymentMethod: stripe.String(data.Card),
	})

	if err != nil {
		errorHandler.PaymentIntentCaptureError(err)
		return
	}

	redisHandler := NewPaymentRedis(p.App.GetRedisClient())
	err = redisHandler.UpdatePaymentIntent(intent)
	if err != nil {
		log.Printf("❌ Failed to update payment intent in Redis: %v", err)
	}

	responseData := map[string]string{
		"paymentIntentId": intent.ID,
		"message":         "Payment intent captured successfully",
	}

	utils.JsonResponse(w, responseData, http.StatusOK)
}
