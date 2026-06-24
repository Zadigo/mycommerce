package main

import (
	"context"
	"os"
	"os/signal"

	"github.com/Zadigo/gopurchase/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	server := server.NewServerApp(ctx, ".")
	// err = server.Start()
	// if err != nil {
	// 	log.Panicf("❌ Could not start server: %v", err)
	// }
	server.Start()
}
