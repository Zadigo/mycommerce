package ticker

import (
	"fmt"
	"time"

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

func stripeSchedulerJob(app *TickerApp) {
	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["stripe"] = scheduler

	_, err := scheduler.Every(2 * time.Minute).Do(func() {

	})

	app.chErrors <- fmt.Errorf("⚠️ Failed to start Stripe scheduler job: %w", err)

	scheduler.StartBlocking()
}
