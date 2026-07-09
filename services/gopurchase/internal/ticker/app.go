package ticker

import (
	"context"
	"log"
	"os"
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
	log.Printf("🔵 Starting %s ticker application...", os.Getenv("SERVICE_NAME"))

	go globalJob(t)
	go stripeJob(t)
	go paymentIntentsJob(t)

	go func() {
		for {
			select {
			case err, ok := <-t.chErrors:
				if ok {
					log.Printf("🔴 %s ticker error: %v", os.Getenv("SERVICE_NAME"), err)
					return
				}
				close(t.chErrors)
			case <-t.ctx.Done():
				return
			}
		}
	}()

	<-t.ctx.Done()

	log.Println("⚡️ Shutting down TickerApp...")

	for _, scheduler := range t.schedulers {
		scheduler.Stop()
	}

	return nil
}

func (t *TickerApp) GetRedisClient() *redis.Client {
	return t.redisClient
}

func (t *TickerApp) GetContext() context.Context {
	return t.ctx
}

func NewTickerApp(serverApp models.ServerAppInterface) models.AppInterface {
	ctx := serverApp.GetContext()

	return &TickerApp{
		ctx:         ctx,
		serverApp:   serverApp,
		redisClient: serverApp.GetRedisClient(),
		debug:       serverApp.GetDebug(),
		chErrors:    make(chan error, 100),
		schedulers:  map[string]*gocron.Scheduler{},
	}
}
