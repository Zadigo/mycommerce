package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"

	"github.com/Zadigo/gopurchase/internal/backend/server"
)

func main() {
	rootDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("❌ Failed to get current working directory: %v", err)
	}

	app := server.NewApp(server.LoadConfig(rootDir))
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	err = app.Start(ctx)
	if err != nil {
		fmt.Printf("Could not start server %s", err)
	}

	log.Printf("🚀 Starting purchase service...")
}
