package app

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/go-chi/chi"
	"github.com/redis/go-redis/v9"
)

// HttpApp is the main application struct that holds 
// the necessary components for running the HTTP server.
type HttpApp struct {
	redisClient *redis.Client
	serverApp   models.ServerAppInterface
	router      *chi.Mux
	ctx         context.Context
}

func (a *HttpApp) Start() error {
	port, err := strconv.ParseUint(os.Getenv("PORT"), 10, 16)
	if err != nil {
		return fmt.Errorf("🔴 Invalid port: %w", err)
	}

	serverConfig := a.serverApp.GetConfig()
	serverConfig.Port = strconv.FormatUint(port, 10)

	log.Printf("⚡️ Starting server on port %s...", serverConfig.Port)
	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", serverConfig.Port),
		Handler: a.router,
	}

	// Redis
	err = a.redisClient.Ping(a.ctx).Err()
	if err != nil {
		return fmt.Errorf("🔴 Could not connect to Redis: %w", err)
	}

	defer func() {
		err := a.redisClient.Close()
		if err != nil {
			log.Printf("🔴 Error closing Redis client: %s", err)
		}
	}()

	ch := make(chan error, 1)

	go func() {
		log.Print("🟢 Server ready to receive requests...")
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			ch <- fmt.Errorf("🔴 Could not start server: %w", err)
		}
	}()

	select {
	case err := <-ch:
		return err
	case <-a.ctx.Done():
		log.Println("⚡️ Shutting down server...")

		timeoutCtx, cancel := context.WithTimeout(a.ctx, 10*time.Second)
		defer cancel()

		return server.Shutdown(timeoutCtx)
	}
}

func NewApp(serverApp models.ServerAppInterface) models.AppInterface {
	redisAddress := os.Getenv("REDIS_ADDRESS")

	if redisAddress == "" {
		redisAddress = "localhost:6379"
	}

	app := &HttpApp{
		ctx:         serverApp.GetContext(),
		serverApp:   serverApp,
		redisClient: serverApp.GetRedisClient(),
	}
	app.loadRoutes()
	return app
}
