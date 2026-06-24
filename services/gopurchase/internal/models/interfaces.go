package models

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type AppInterface interface {
	Start() error
}

type ServerAppInterface interface {
	AppInterface
	GetConfig() *ServerConfig
	GetContext() context.Context
	GetRedisClient() *redis.Client
	GetDebug() bool
}
