package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"path/filepath"

	"github.com/Zadigo/gopurchase/internal/backend"
	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/Zadigo/gopurchase/internal/server"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

func preStartup(ctx context.Context) (*redis.Client, *models.ServerOptions, error) {
	client, err := backend.CreateRedisConnection(ctx)
	if err != nil {
		return nil, nil, err
	}

	options := models.CreateOptions(".")
	if err := options.LoadYamlConfig(ctx); err != nil {
		return nil, nil, err
	}

	if rootDir, err := filepath.Abs("."); err != nil {
		return nil, nil, err
	} else {
		options.RootDir = rootDir
	}

	options.Redis = client
	return client, options, nil
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	ctx = context.WithValue(ctx, "debug", os.Getenv("DEBUG") == "true")

	_, options, err := preStartup(ctx)
	if err != nil {
		log.Panicf("❌ Redis error: %v", err)
	}

	server := server.NewServerApp(ctx, options)
	err = server.Start(ctx)

	if err != nil {
		log.Panicf("❌ Could not start server: %v", err)
	}
}
