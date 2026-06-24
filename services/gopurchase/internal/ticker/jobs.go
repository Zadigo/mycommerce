package ticker

import (
	"fmt"
	"log"
	"time"

	"github.com/Zadigo/gopurchase/internal/handlers"
	"github.com/Zadigo/gopurchase/internal/utils/requests"
	"github.com/go-co-op/gocron"
)

// Start a goroutine to run the scheduler and perform periodic checks
func globalJob(app *TickerApp) {
	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["global"] = scheduler

	_, err := scheduler.Every(2 * time.Minute).Do(func() {
		config := app.serverApp.GetConfig()

		redisHandler := &TickerRedis{
			redisClient: app.redisClient,
			storageKey:  "gopurchase:ticker",
		}

		if config.YamlConfig == nil {
			app.chErrors <- fmt.Errorf("⚠️ No YAML configuration file found")
			return
		}

		if len(config.YamlConfig.Endpoints) == 0 {
			app.chErrors <- fmt.Errorf("⚠️ No endpoints defined in the YAML configuration file")
			return
		}

		for _, endpoint := range config.YamlConfig.Endpoints {
			err := requests.SendRequest(endpoint.Url, "GET", nil, map[string]string{})
			if err != nil {
				app.chErrors <- fmt.Errorf("⚠️ Could not perform request for endpoint %s: %w", endpoint.Name, err)

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

	app.chErrors <- fmt.Errorf("⚠️ Failed to start global scheduler job: %v", err)

	scheduler.StartBlocking()
}

// Start a goroutine to run the scheduler and perform periodic checks for Stripe
func stripeSchedulerJob(app *TickerApp) {
	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["stripe"] = scheduler

	_, err := scheduler.Every(2 * time.Minute).Do(func() {

	})

	app.chErrors <- fmt.Errorf("⚠️ Failed to start Stripe scheduler job: %w", err)

	scheduler.StartBlocking()
}

// Starts a gorouting that iterates through all the payment intents
// stored in Redis in order to check for status. If they are captured,
// the goroutine will perform certain tasks (e.g. like sending the details to
// the webhook endpoint).
func paymentIntentsJob(app *TickerApp) {
	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["stripe"] = scheduler

	_, err := scheduler.Every(2 * time.Minute).Do(func() {
		redisHandler := handlers.NewPaymentRedis(app.GetRedisClient())
		keys, err := redisHandler.GetAllKeys()
		if err != nil {
			app.chErrors <- fmt.Errorf("⚠️ Failed to retrieve payment intent keys: %w", err)
			return
		}

		for _, key := range keys {
			captured, err := redisHandler.IsCaptured(key)
			if err != nil {
				app.chErrors <- fmt.Errorf("⚠️ Failed to check if payment intent %s is captured: %w", key, err)
				continue
			}
			if !captured {
				continue
			}

			// If the payment intent is captured, retrieve it and send it to the webhook endpoint
			intent, err := redisHandler.GetPaymentIntent(key)
			if err != nil {
				app.chErrors <- fmt.Errorf("⚠️ Failed to retrieve payment intent %s: %w", key, err)
				continue
			}

			// Do something with the captured payment intent, e.g., send it to a webhook endpoint
			log.Printf("Payment intent %s is captured. Sending details to webhook endpoint...", intent.ID)
		}
	})

	app.chErrors <- fmt.Errorf("⚠️ Failed to start payment intents scheduler job: %w", err)

	scheduler.StartBlocking()
}
