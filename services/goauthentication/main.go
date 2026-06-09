package main

import (
	"context"
	"log"
	"os"
	"os/signal"

	"github.com/Zadigo/goauthentication/internal/server"
)

func main() {
	rootDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("❌ Could not get current working directory: %v", err)
	}
	app := server.NewApp(server.LoadConfig(rootDir))
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
	err = app.Start(ctx)
	if err != nil {
		log.Fatalf("❌ Could not start server: %v", err)
	}

}
