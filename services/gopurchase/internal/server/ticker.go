package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-co-op/gocron"
	"github.com/redis/go-redis/v9"
)

type TickerResponse struct {
	State bool      `json:"state"`
	Date  time.Time `json:"date"`
}

// Ticker allows the application to perform a periodic checks on the
// on the endpoints and webhooks defined in the YAML configuration file.
type Ticker struct {
	ctx          context.Context
	scheduler    *gocron.Scheduler
	serverConfig *ServerConfig
	redisClient  *redis.Client
	Key          string
}

func (t *Ticker) Start() {
	t.scheduler = gocron.NewScheduler(time.UTC)

	ch := make(chan error, 100)

	go func() {
		_, _ = t.scheduler.Every(2 * time.Minute).Do(func(j *gocron.Job) {
			for _, endpoint := range t.serverConfig.YamlConfig.Endpoints {
				client, err := http.NewRequest("GET", endpoint.Url, nil)
				if err != nil {
					ch <- err
					continue
				}
				response, err := http.DefaultClient.Do(client)
				if err != nil {
					ch <- err
					continue
				}

				data := &TickerResponse{}
				err = json.NewDecoder(response.Body).Decode(&data)
				if err != nil {
					ch <- err
					continue
				}

				data.Date = time.Now()

				if !data.State {
					ch <- err
					log.Printf("⚠️ Endpoint %s is not healthy", endpoint.Name)
					t.redisClient.HIncrBy(t.ctx, fmt.Sprintf("%s:status:failure", t.Key), endpoint.Name, 1)
				} else {
					t.redisClient.HIncrBy(t.ctx, fmt.Sprintf("%s:status:success", t.Key), endpoint.Name, 1)
				}
				response.Body.Close()

				t.redisClient.LPush(t.ctx, fmt.Sprintf("%s:checks", t.Key), data)
				t.redisClient.Expire(t.ctx, fmt.Sprintf("%s:checks", t.Key), 24*time.Hour)

			}
		})
	}()
}

func NewTicker(ctx context.Context, serverConfig *ServerConfig, redisClient *redis.Client) *Ticker {
	return &Ticker{
		ctx:          ctx,
		serverConfig: serverConfig,
		redisClient:  redisClient,
		Key:          "gopurchase",
	}
}
