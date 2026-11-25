package ticker

import (
	"context"
	"log"
	"os"
	"sync"
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
	schedulers  map[string]*gocron.Scheduler
	serverApp   models.ServerAppInterface
	redisClient *redis.Client
	debug       bool
	cancelFunc  context.CancelFunc
}

func (t *TickerApp) Cancel() {
	sync.OnceFunc(t.cancelFunc)
}

func (t *TickerApp) Start(ctx context.Context) error {
	log.Printf("🔵 Starting %s ticker application...", os.Getenv("SERVICE_NAME"))

	tickerCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	g := sync.WaitGroup{}

	g.Add(1)
	g.Go(func() {
		defer g.Done()
		globalJob(tickerCtx, t)
	})

	g.Add(1)
	g.Go(func() {
		defer g.Done()
		stripeJob(tickerCtx, t)
	})

	g.Add(1)
	g.Go(func() {
		defer g.Done()
		paymentIntentsJob(tickerCtx, t)
	})

	g.Wait()

	return nil

	// go globalJob(t)
	// go stripeJob(t)
	// go paymentIntentsJob(t)

	// go func() {
	// 	for {
	// 		select {
	// 		case err, ok := <-t.chErrors:
	// 			if ok {
	// 				log.Printf("🔴 %s ticker error: %v", os.Getenv("SERVICE_NAME"), err)
	// 				return
	// 			}
	// 			close(t.chErrors)
	// 		case <-ctx.Done():
	// 			return
	// 		}
	// 	}
	// }()

	// <-ctx.Done()

	// log.Println("⚡️ Shutting down TickerApp...")

	// for _, scheduler := range t.schedulers {
	// 	scheduler.Stop()
	// }

	// return nil
}

func (t *TickerApp) GetRedisClient() *redis.Client {
	return t.redisClient
}

func NewTickerApp(ctx context.Context, serverApp models.ServerAppInterface) models.AppInterface {
	return &TickerApp{
		serverApp:   serverApp,
		redisClient: serverApp.GetRedisClient(),
		debug:       serverApp.GetDebug(),
		schedulers:  map[string]*gocron.Scheduler{},
	}
}
