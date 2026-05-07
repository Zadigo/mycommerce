package backend

import (
	"context"

	"github.com/redis/go-redis/v9"
)

func NewRedisClient(r RedisConfig) *redis.Client {
	options, err := redis.ParseURL(r.Address)
	if err != nil {
		panic(err)
	}

	client := redis.NewClient(options)

	status := client.Ping(context.Background())
	if status.Err() != nil {
		panic(status.Err())
	}

	return client
}
