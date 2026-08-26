package ticker

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	SUCCESS = "success"
	FAILURE = "failure"
)

type TickerPayload struct {
	EndpointName string    `json:"endpointName"`
	EndpointUrl  string    `json:"endpointUrl"`
	State        string    `json:"state"`
	Date         time.Time `json:"date"`
}

type TickerRedis struct {
	ctx         context.Context
	redisClient *redis.Client
	storageKey  string
}

func (t *TickerRedis) Create(data TickerPayload) error {
	if data.EndpointName == "" || data.EndpointUrl == "" || data.State == "" {
		return fmt.Errorf("⚠️ Invalid data provided for TickerPayload: %+v", data)
	}

	t.redisClient.RPush(t.ctx, t.storageKey, data)

	if t.redisClient.Exists(t.ctx, t.storageKey).Val() > 100 {
		// Trim the list to keep only the last 100 entries
		t.redisClient.LTrim(t.ctx, t.storageKey, -100, -1)
	}
	return nil
}

func (t *TickerRedis) CreateSuccessResponse(data TickerPayload) error {
	data.State = SUCCESS
	return t.Create(data)
}

func (t *TickerRedis) CreateFailureResponse(data TickerPayload) error {
	data.State = FAILURE
	return t.Create(data)
}
