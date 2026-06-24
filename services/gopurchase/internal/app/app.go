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
	chErrors    chan error
	ctx         context.Context
}

func (a *HttpApp) Start() error {
	log.Printf("🔵 Starting %s server application...", os.Getenv("SERVICE_NAME"))

	port, err := strconv.ParseUint(os.Getenv("PORT"), 10, 16)
	if err != nil {
		log.Panicf("🔴 Invalid port: %v", err)
	}

	serverConfig := a.serverApp.GetConfig()
	serverConfig.Port = strconv.FormatUint(port, 10)

	projectName := os.Getenv("SERVICE_NAME")

	log.Printf("⚡️ Starting %s HTTP server on port %s...", projectName, serverConfig.Port)
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: a.router,
	}

	go func() {
		log.Printf("🟢 %s HTTP server ready to receive requests...", projectName)
		a.chErrors <- server.ListenAndServe()
	}()

	select {
	case err := <-a.chErrors:
		log.Printf("🔴 %s HTTP server error: %v", projectName, err)
		return err
	case <-a.ctx.Done():
		log.Println("⚡️ Shutting down HTTP server...")

		timeoutCtx, cancel := context.WithTimeout(a.ctx, 10*time.Second)
		defer cancel()

		return server.Shutdown(timeoutCtx)
	}
}

func NewApp(serverApp models.ServerAppInterface) models.AppInterface {
	app := &HttpApp{
		ctx:         serverApp.GetContext(),
		serverApp:   serverApp,
		redisClient: serverApp.GetRedisClient(),
		chErrors:    make(chan error),
	}

	app.loadRoutes()
	return app
}
