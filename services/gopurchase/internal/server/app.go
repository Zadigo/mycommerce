package server

import (
	"context"
	"os"

	"github.com/Zadigo/gopurchase/internal/app"
	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/Zadigo/gopurchase/internal/ticker"
	"github.com/redis/go-redis/v9"
	"golang.org/x/sync/errgroup"
)

// ServerApp is a central application that manages the process for multiple
// other applications for this project. It is responsible for managing the lifecycle
// of the applications, including starting and stopping them, as well as providing
// a common context and configuration for all applications. It allows each sub-application
// to be independent from each other, while still being able to share common resources and configuration.
type ServerApp struct {
	ctx     context.Context
	rootDir string
	options *models.ServerOptions

	httpErrors   chan error
	tickerErrors chan error
	Debug        bool
}

func (s *ServerApp) GetRedisClient() *redis.Client {
	return s.options.Redis
}

func (s *ServerApp) GetContext() context.Context {
	return s.ctx
}

func (s *ServerApp) GetDebug() bool {
	return s.Debug
}

func (s *ServerApp) GetOptions() *models.ServerOptions {
	return s.options
}

func (s *ServerApp) Start(ctx context.Context) error {
	serverCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	httpApp := app.NewApp(serverCtx, s)
	tickerApp := ticker.NewTickerApp(serverCtx, s)

	g := &errgroup.Group{}

	g.Go(func() error {
		return httpApp.Start(serverCtx)
	})

	g.Go(func() error {
		return tickerApp.Start(serverCtx)
	})
	
	return g.Wait()
}

func NewServerApp(ctx context.Context, options *models.ServerOptions) models.ServerAppInterface {
	return &ServerApp{
		ctx:          ctx,
		rootDir:      options.RootDir,
		httpErrors:   make(chan error),
		tickerErrors: make(chan error),
		Debug:        os.Getenv("DEBUG") == "true",
		options:      options,
	}
}
