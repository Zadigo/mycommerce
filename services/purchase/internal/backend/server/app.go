package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/redis/go-redis/v9"
)

type App struct {
	redisClient  *redis.Client
	serverConfig *ServerConfig
	router       *chi.Mux
	ctx          context.Context
}

type AppInterface interface {
	Start(ctx context.Context) error
}

func (a *App) Start(ctx context.Context) error {
	a.ctx = ctx

	port, err := strconv.ParseUint(a.serverConfig.Port, 10, 16)
	if err != nil {
		return fmt.Errorf("invalid port: %w", err)
	}

	log.Printf("⚡️ Starting server on port %d...", port)
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: a.router,
	}

	// Redis
	err = a.redisClient.Ping(a.ctx).Err()
	if err != nil {
		return fmt.Errorf("could not connect to Redis: %w", err)
	}

	defer func() {
		err := a.redisClient.Close()
		if err != nil {
			log.Printf("Error closing Redis client: %s", err)
		}
	}()

	ch := make(chan error, 1)

	go func() {
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			ch <- fmt.Errorf("could not start server: %w", err)
		}
	}()

	select {
	case err := <-ch:
		return err
	case <-ctx.Done():
		fmt.Println("Shutting down server...")
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		return server.Shutdown(timeoutCtx)
	}
}

func NewApp(serverConfig *ServerConfig) AppInterface {
	app := &App{
		redisClient: redis.NewClient(&redis.Options{
			Addr: "localhost:6379",
			DB:   0,
		}),
		serverConfig: serverConfig,
	}
	app.loadRoutes()
	return app
}
