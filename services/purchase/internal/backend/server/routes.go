package server

import (
	"log"
	"time"

	"github.com/Zadigo/purchase/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/stripe/stripe-go/v85"
)

// NewApp initializes the application with the provided server
// configuration and Redis client. It sets up the necessary routes
// and returns an instance of the App.
func (a *App) loadRoutes() {
	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(middleware.Logger)

	router.Route("/payments", a.loadPaymentRoutes)
	router.Route("/auth", a.loadAuthRoutes)
	a.router = router
}

func (a *App) loadPaymentRoutes(router chi.Router) {
	paymentApi := handlers.PaymentApi{
		PaymentClient: &stripe.Client{},
		ServerConfig:  a.serverConfig,
		Ctx:           a.ctx,
	}

	err := paymentApi.LoadStripeClient()
	if err != nil {
		log.Fatalf("Failed to load payment client: %v", err)
	}

	router.Post("/intent", paymentApi.CreateIntent)
	router.Post("/capture", paymentApi.CaptureIntent)
	router.Post("/update", paymentApi.UpdateIntent)
}

func (a *App) loadAuthRoutes(router chi.Router) {
	authApi := handlers.AuthenticationApi{
		ServerConfig: a.serverConfig,
		Ctx:          a.ctx,
	}
	router.Post("/token", authApi.Authenticate)
}
