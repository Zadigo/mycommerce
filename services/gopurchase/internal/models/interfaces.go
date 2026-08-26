package models

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type AppInterface interface {
	// Start starts the application and returns an error if it fails to start.
	Start() error
	// GetRedisClient returns the Redis client used by the application.
	GetRedisClient() *redis.Client
	// GetContext returns the context of the application.
	GetContext() context.Context
}

type ServerAppInterface interface {
	AppInterface
	// GetConfig returns the server configuration.
	GetConfig() *ServerConfig
	// GetContext returns the context of the server application.
	GetContext() context.Context
	// GetRedisClient returns the Redis client used by the server application.
	GetRedisClient() *redis.Client
	// GetDebug returns the debug mode status of the server application.
	GetDebug() bool
}
