package models

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type AppInterface interface {
	// Start starts the application and returns an error if it fails to start.
	Start(ctx context.Context) error
}

type HttpAppInterface interface {
	AppInterface
	GetServer() ServerAppInterface
}

type ServerAppInterface interface {
	AppInterface
	// GetConfig returns the server configuration.
	GetOptions() *ServerOptions
	// GetRedisClient returns the Redis client used by the server application.
	GetRedisClient() *redis.Client
	// GetDebug returns the debug mode status of the server application.
	GetDebug() bool
}
