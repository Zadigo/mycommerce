package ticker

import (
	"context"
	"log"
	"time"

	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/go-co-op/gocron"
	"github.com/redis/go-redis/v9"
)

type TickerResponse struct {
	State bool      `json:"state"`
	Date  time.Time `json:"date"`
}

// TickerApp allows the application to perform periodic checks on the
// endpoints and webhooks defined in the YAML configuration file. It can
// also serve as a tool to monitor the health of external services (like Stripe)
// and ensure that they are functioning correctly. The TickerApp is designed
// to be run as a separate process from the main HTTP server.
type TickerApp struct {
	ctx         context.Context
	schedulers  map[string]*gocron.Scheduler
	serverApp   models.ServerAppInterface
	redisClient *redis.Client
	debug       bool
	chErrors    chan error
}

func (t *TickerApp) Start() error {
	go globalJob(t)
	go stripeSchedulerJob(t)

	// go func() {
	// 	_, _ = t.scheduler.Every(2 * time.Minute).Do(func(j *gocron.Job) {
	// 		config := t.serverApp.GetConfig()

	// 		redisHandler := &TickerRedis{
	// 			redisClient: t.redisClient,
	// 			storageKey:  "gopurchase:ticker",
	// 		}

	// 		for _, endpoint := range config.YamlConfig.Endpoints {
	// 			err := requests.SendRequest(endpoint.Url, "GET", nil, map[string]string{})
	// 			if err != nil {
	// 				t.chErrors <- fmt.Errorf("⚠️ Could not perform request for endpoint %s: %w", endpoint.Name, err)

	// 				redisHandler.CreateFailureResponse(TickerPayload{
	// 					EndpointName: endpoint.Name,
	// 					EndpointUrl:  endpoint.Url,
	// 					State:        "failure",
	// 					Date:         time.Now(),
	// 				})
	// 			} else {
	// 				redisHandler.CreateSuccessResponse(TickerPayload{
	// 					EndpointName: endpoint.Name,
	// 					EndpointUrl:  endpoint.Url,
	// 					State:        "success",
	// 					Date:         time.Now(),
	// 				})
	// 			}
	// 		}
	// 	})
	// }()

	select {
	case err := <-t.chErrors:
		return err
	case <-t.ctx.Done():
		log.Println("⚡️ Shutting down ticker...")

		for _, scheduler := range t.schedulers {
			scheduler.Stop()
		}

		return nil
	}
}

func NewTickerApp(serverApp models.ServerAppInterface) models.AppInterface {
	return &TickerApp{
		ctx:         serverApp.GetContext(),
		serverApp:   serverApp,
		redisClient: serverApp.GetRedisClient(),
		debug:       serverApp.GetDebug(),
		chErrors:    make(chan error, 100),
	}
}
