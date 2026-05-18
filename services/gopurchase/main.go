package main

import (
	"context"
	"log"
	"os"
	"os/signal"

	"github.com/Zadigo/gopurchase/internal/backend/server"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("❌ Error loading .env file: %v", err)
	}

	rootDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("❌ Failed to get current working directory: %v", err)
	}

	app := server.NewApp(server.LoadConfig(rootDir))
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	err = app.Start(ctx)
	if err != nil {
		log.Fatalf("❌ Could not start server: %v", err)
	}
}
