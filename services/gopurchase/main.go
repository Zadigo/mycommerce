package main

import (
	"context"
	"log"
	"os"
	"os/signal"

	"github.com/Zadigo/gopurchase/internal/server"
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

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	app := server.NewApp(ctx, server.LoadConfig(rootDir))
	err = app.Start()

	if err != nil {
		log.Fatalf("❌ Could not start server: %v", err)
	}
}
