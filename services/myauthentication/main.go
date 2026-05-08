package main

import (
	"net/http"
	"os"

	"github.com/Zadigo/myauthentication/internal/backend"
	"github.com/Zadigo/myauthentication/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	projectPath, _ := os.Getwd()
	serverConfig := backend.NewServerConfig(projectPath)

	redisClient := backend.NewRedisClient(serverConfig.Config.Redis)
	authenticationBackend := backend.NewAuthenticationBackend(redisClient, serverConfig)

	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	router.Post("/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.LoginEndpoint(w, r, serverConfig, authenticationBackend)
	})

	router.Post("/logout", func(w http.ResponseWriter, r *http.Request) {
		handlers.LogoutEndpoint(w, r, serverConfig, authenticationBackend)
	})

	router.Post("/verify", func(w http.ResponseWriter, r *http.Request) {
		handlers.VerifyEndpoint(w, r, serverConfig, authenticationBackend)
	})

	http.ListenAndServe(":8080", router)
}
