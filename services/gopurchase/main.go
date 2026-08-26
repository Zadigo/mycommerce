package main

import (
	"context"
	"log"
	"os"
	"os/signal"

	"github.com/Zadigo/gopurchase/internal/server"
	"github.com/Zadigo/gopurchase/internal/utils"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	absPath, err := utils.GetAbsolutePath(".")
	if err != nil {
		log.Panicf("❌ Could not get absolute path: %v", err)
	}

	ctx = context.WithValue(ctx, "rootDir", absPath)
	ctx = context.WithValue(ctx, "debug", os.Getenv("DEBUG") == "true")

	server := server.NewServerApp(ctx)
	err = server.Start()
	if err != nil {
		log.Panicf("❌ Could not start server: %v", err)
	}
}
