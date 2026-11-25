package backend

import (
	"cmp"
	"context"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

func CreateRedisConnection(ctx context.Context) (*redis.Client, error) {
	options, err := redis.ParseURL(cmp.Or(os.Getenv("REDIS_URL"), "redis://localhost:6379"))
	if err != nil {
		return nil, fmt.Errorf("Failed to resolve redis url")
	}

	pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	instance := redis.NewClient(options)
	if err := instance.Ping(pingCtx).Err(); err != nil {
		instance.Close()
		return nil, err
	}

	slog.Info("Redis was loaded successfully", "address", options.Addr)
	return instance, nil
}
