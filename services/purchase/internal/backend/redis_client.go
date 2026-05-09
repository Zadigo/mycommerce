package backend

import (
	"github.com/redis/go-redis/v9"
)

func NewRedisClient() *redis.Client {
	options, err := redis.ParseURL("redis://@localhost:6379/0")
	if err != nil {
		panic(err)
	}
	client := redis.NewClient(options)
	return client
}
