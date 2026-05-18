package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/redis/go-redis/v9"
)

type App struct {
	serverConfig *ServerConfig
	redisClient  *redis.Client
	router       *chi.Mux
	ctx          context.Context
}

func (a *App) Start(ctx context.Context) error {
	log.Print("⚡️ Starting Go Authentication micro-service...")

	a.ctx = ctx
	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", a.serverConfig.Port),
		Handler: a.router,
	}

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
	case <-ctx.Done():
		log.Println("⚡️ Shutting down server...")
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		return server.Shutdown(timeoutCtx)
	}
}

func NewApp(serverConfig *ServerConfig) *App {
	app := &App{
		serverConfig: serverConfig,
		redisClient: redis.NewClient(&redis.Options{
			Addr: "localhost:6379",
			DB:   0,
		}),
	}
	app.loadRoutes()
	return app
}
