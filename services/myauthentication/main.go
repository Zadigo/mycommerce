package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Zadigo/myauthentication/internal/backend"
	"github.com/Zadigo/myauthentication/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	log.Printf("🚀 Starting Authentication service...")

	projectPath, _ := os.Getwd()
	serverConfig := backend.NewServerConfig(projectPath)

	redisClient := backend.NewRedisClient(serverConfig.Config.Redis)
	authenticationBackend := backend.NewAuthenticationBackend(redisClient, serverConfig)

	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(middleware.AllowContentType("application/json"))
	router.Use(middleware.Throttle(100)) // Limit to 100 requests per second

	router.Post("/auth/v1/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.LoginEndpoint(w, r, serverConfig, authenticationBackend)
	})

	router.Post("/logout", func(w http.ResponseWriter, r *http.Request) {
		handlers.LogoutEndpoint(w, r, serverConfig, authenticationBackend)
	})

	router.Post("/auth/v1/verify", func(w http.ResponseWriter, r *http.Request) {
		handlers.VerifyEndpoint(w, r, serverConfig, authenticationBackend)
	})

	log.Printf("⚡️ Authentication service is running on port 8080")
	http.ListenAndServe(":9000", router)
}
