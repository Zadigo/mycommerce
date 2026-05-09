package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Zadigo/purchase/internal/backend"
	"github.com/Zadigo/purchase/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/joho/godotenv"
)

func main() {
	log.Printf("🚀 Starting purchase service...")

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	redisClient := backend.NewRedisClient()
	log.Print("⚡️ Started Redis client...")

	rootDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("❌ Failed to get current working directory: %v", err)
	}

	serverConfig := backend.NewServerConfig(rootDir)
	serverConfig.SetConfig(redisClient)

	err = serverConfig.SetConfig(redisClient)
	if err != nil {
		log.Fatalf("❌ Failed to load YAML configuration: %v", err)
	}

	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(middleware.Logger)

	router.Route("/payment", func(r chi.Router) {
		router.Post("/", func(w http.ResponseWriter, r *http.Request) {
			handlers.CreatePaymentIntentHandler(w, r, serverConfig)
		})

		router.Post("/update", func(w http.ResponseWriter, r *http.Request) {
			handlers.UpdatePaymentIntentHandler(w, r, serverConfig)
		})

		router.Post("/capture", func(w http.ResponseWriter, r *http.Request) {
			handlers.ProcessPaymentHandler(w, r, serverConfig)
		})
	})

	err = http.ListenAndServe(":9000", router)
	if err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
