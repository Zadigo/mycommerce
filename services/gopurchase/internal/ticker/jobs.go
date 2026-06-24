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

	_, err := scheduler.Every(2 * time.Minute).Do(func(j *gocron.Job) {
		config := app.serverApp.GetConfig()

		redisHandler := &TickerRedis{
			redisClient: app.redisClient,
			storageKey:  "gopurchase:ticker",
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

	if err != nil {
		app.chErrors <- fmt.Errorf("⚠️ Could not schedule global job: %w", err)
		return
	}

	scheduler.StartBlocking()
}

func stripeSchedulerJob(app *TickerApp) {
	scheduler := gocron.NewScheduler(time.UTC)
	app.schedulers["stripe"] = scheduler

	_, err := scheduler.Every(2 * time.Minute).Do(func(j *gocron.Job) {

	})

	if err != nil {
		app.chErrors <- fmt.Errorf("⚠️ Could not schedule stripe job: %w", err)
		return
	}

	scheduler.StartBlocking()
}
