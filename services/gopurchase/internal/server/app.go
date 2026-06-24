package server

import (
	"context"
	"io/fs"
	"log"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/Zadigo/gopurchase/internal/app"
	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/Zadigo/gopurchase/internal/ticker"
	"github.com/redis/go-redis/v9"
)

// ServerApp is a central application that manages the process for multiple
// other applications for this project. It is responsible for managing the lifecycle
// of the applications, including starting and stopping them, as well as providing
// a common context and configuration for all applications. It allows each sub-application
// to be independent from each other, while still being able to share common resources and configuration.
type ServerApp struct {
	ctx         context.Context
	rootDir     string
	config      *models.ServerConfig
	redisClient *redis.Client

	httpApp      models.AppInterface
	tickerApp    models.AppInterface
	httpErrors   chan error
	tickerErrors chan error
	Debug        bool
}

func (s *ServerApp) GetContext() context.Context {
	return s.ctx
}

func (s *ServerApp) GetRedisClient() *redis.Client {
	if s.redisClient != nil {
		return s.redisClient
	}

	if s.redisClient != nil && s.redisClient.Ping(s.ctx).Err() == nil {
		return s.redisClient
	}

	redisAddress := os.Getenv("REDIS_ADDRESS")

	if redisAddress == "" {
		redisAddress = "localhost:6379"
	}

	s.redisClient = redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	log.Printf("🔵 Redis client initialized successfully...")
	return s.redisClient
}

func (s *ServerApp) GetConfig() *models.ServerConfig {
	if s.config != nil {
		return s.config
	}

	s.config = models.LoadConfig(s.rootDir)
	return s.config
}

func (s *ServerApp) Start() error {
	absPath, err := filepath.Abs(s.rootDir)
	if err != nil {
		log.Printf("❌ Failed to get absolute path: %v", err)
		return nil
	}

	result := path.Ext(absPath)
	if result != "" {
		log.Printf("❌ Base directory should be a directory, got a file: %s", absPath)
		return nil
	}

	// Once the base directory is validated, we can walk through it to find the config.yaml file
	filepath.WalkDir(absPath, func(path string, d fs.DirEntry, err error) error {
		if strings.Contains(path, ".yaml") {
			if strings.Contains(path, "config.yaml") {
				// TODO: Load the config.yaml file and initialize the appConfig
				return nil
			}
		}

		return nil
	})

	// Initialize the Redis client
	_ = s.GetRedisClient()

	if s.httpApp == nil {
		s.httpApp = app.NewApp(s)
	}

	if s.tickerApp == nil {
		s.tickerApp = ticker.NewTickerApp(s)
	}

	go func() {
		s.httpErrors <- s.httpApp.Start()
	}()

	go func() {
		s.tickerErrors <- s.tickerApp.Start()
	}()

	log.Printf("🔵 %s server started successfully...", os.Getenv("SERVICE_NAME"))

	<-s.ctx.Done()

	log.Printf("⚡️ Shutting down %s server...", os.Getenv("SERVICE_NAME"))

	return nil
}

func (s *ServerApp) GetDebug() bool {
	return s.Debug
}

func NewServerApp(ctx context.Context, rootDir string) models.ServerAppInterface {
	return &ServerApp{
		ctx:          ctx,
		rootDir:      rootDir,
		config:       &models.ServerConfig{},
		httpApp:      nil,
		tickerApp:    nil,
		httpErrors:   make(chan error),
		tickerErrors: make(chan error),
		Debug:        os.Getenv("DEBUG") == "true",
	}
}
