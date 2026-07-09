package ticker

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/Zadigo/gopurchase/internal/handlers"
	"github.com/Zadigo/gopurchase/internal/utils/requests"
	"github.com/go-co-op/gocron"
)

// Start a goroutine to run the scheduler and perform periodic checks
func globalJob(app *TickerApp) {
	localCtx, cancel := context.WithCancel(app.ctx)
	defer cancel()

	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["global"] = scheduler

	errorHandler := NewTickerErrors(localCtx)

	_, err := scheduler.Every(2 * time.Minute).Do(func() {
		config := app.serverApp.GetConfig()

		redisHandler := &TickerRedis{
			redisClient: app.redisClient,
			storageKey:  "gopurchase:ticker",
		}

		if config.YamlConfig == nil {
			app.chErrors <- errorHandler.BasicError(fmt.Errorf("⚠️ No YAML configuration file found"))
			return
		}

		if len(config.YamlConfig.Endpoints) == 0 {
			app.chErrors <- errorHandler.NoEndpointsError()
			return
		}

		for _, endpoint := range config.YamlConfig.Endpoints {
			err := requests.SendRequest(endpoint.Url, "GET", nil, map[string]string{})
			if err != nil {
				app.chErrors <- errorHandler.EndpointError(endpoint.Name, err)

				redisHandler.CreateFailureResponse(TickerPayload{
					EndpointName: endpoint.Name,
					EndpointUrl:  endpoint.Url,
					State:        "failure",
					Date:         time.Now(),
				})
			} else {
				redisHandler.CreateSuccessResponse(TickerPayload{
					EndpointName: endpoint.Name,
					EndpointUrl:  endpoint.Url,
					State:        "success",
					Date:         time.Now(),
				})
			}
		}
	})

	scheduler.StartBlocking()

	app.chErrors <- errorHandler.CreateSchedulerError("global", err)
}

// Start a goroutine to run the scheduler and perform periodic checks for Stripe
func stripeSchedulerJob(app *TickerApp) {
	localCtx, cancel := context.WithCancel(app.ctx)
	defer cancel()

	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["stripe"] = scheduler

	errorHandler := NewTickerErrors(localCtx)

	_, err := scheduler.Every(2 * time.Minute).Do(func() {

	})

	scheduler.StartBlocking()
	app.chErrors <- errorHandler.CreateSchedulerError("stripe", err)
}

// Starts a gorouting that iterates through all the payment intents
// stored in Redis in order to check for status. If they are captured,
// the goroutine will perform certain tasks (e.g. like sending the details to
// the webhook endpoint).
func paymentIntentsJob(app *TickerApp) {
	localCtx, cancel := context.WithCancel(app.ctx)
	defer cancel()

	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["stripe"] = scheduler

	errorHandler := NewTickerErrors(localCtx)

	_, err := scheduler.Every(2 * time.Minute).Do(func() {
		redisHandler := handlers.NewPaymentRedis(app.GetRedisClient())
		keys, err := redisHandler.GetAllKeys()
		if err != nil {
			app.chErrors <- errorHandler.NoPaymentIntentKeysError(err)
			return
		}

		for _, key := range keys {
			captured, err := redisHandler.IsCaptured(key)
			if err != nil {
				app.chErrors <- errorHandler.IntentCaptureVerificationError(key, err)
				continue
			}
			if !captured {
				continue
			}

			// If the payment intent is captured, retrieve it and send it to the webhook endpoint
			intent, err := redisHandler.GetPaymentIntent(key)
			if err != nil {
				app.chErrors <- errorHandler.IntentRetrievalError(key, err)
				continue
			}

			// Do something with the captured payment intent, e.g., send it to a webhook endpoint
			log.Printf("Payment intent %s is captured. Sending details to webhook endpoint...", intent.ID)
		}
	})

	scheduler.StartBlocking()
	app.chErrors <- errorHandler.CreateSchedulerError("payment_intents", err)
}
