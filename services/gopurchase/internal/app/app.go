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
	serverApp models.ServerAppInterface
	router    *chi.Mux
}

func (a *HttpApp) GetServer() models.ServerAppInterface {
	return a.serverApp
}

func (a *HttpApp) Start(ctx context.Context) error {
	log.Printf("🔵 Starting %s server application...", os.Getenv("SERVICE_NAME"))

	port, err := strconv.ParseUint(os.Getenv("PORT"), 10, 16)
	if err != nil {
		log.Panicf("🔴 Invalid port: %v", err)
	}

	options := a.serverApp.GetOptions()
	options.Port = strconv.FormatUint(port, 10)

	projectName := os.Getenv("SERVICE_NAME")

	log.Printf("⚡️ Starting %s HTTP server on port %s...", projectName, options.Port)
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: a.router,
	}

	chErrors := make(chan error, 5)

	go func() {
		log.Printf("🟢 %s HTTP server ready to receive requests...", projectName)
		chErrors <- server.ListenAndServe()
	}()

	select {
	case err := <-chErrors:
		log.Printf("🔴 %s HTTP server error: %v", projectName, err)
		return err
	case <-ctx.Done():
		log.Println("⚡️ Shutting down HTTP server...")

		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()

		return server.Shutdown(timeoutCtx)
	}
}

func (a *HttpApp) GetRedisClient() *redis.Client {
	return a.serverApp.GetOptions().Redis
}

func NewApp(ctx context.Context, serverApp models.ServerAppInterface) models.HttpAppInterface {
	app := &HttpApp{
		serverApp: serverApp,
	}

	app.loadRoutes()
	return app
}
