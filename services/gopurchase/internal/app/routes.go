package app

import (
	"log"
	"time"

	"github.com/Zadigo/gopurchase/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/stripe/stripe-go/v85"
)

// NewApp initializes the application with the provided server
// configuration and Redis client. It sets up the necessary routes
// and returns an instance of the App.
func (a *HttpApp) loadRoutes() {
	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(Cors)
	router.Use(Authorization)
	router.Use(middleware.AllowContentType("application/json"))
	router.Use(middleware.Throttle(1000))
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(JsonHeartbeat("/health"))
	router.Use(middleware.Timeout(60 * time.Second))

	router.Route("/payments", a.loadPaymentRoutes)
	router.Route("/auth", a.loadAuthRoutes)
	a.router = router
}

func (a *HttpApp) loadPaymentRoutes(router chi.Router) {
	paymentApi := handlers.PaymentApi{
		PaymentClient: &stripe.Client{},
		App:           a,
		Ctx:           a.ctx,
	}

	err := paymentApi.SetupStripeClient()
	if err != nil {
		log.Fatalf("Failed to setup Stripe client: %v", err)
	}

	router.Post("/intent", paymentApi.CreateIntent)
	router.Post("/capture", paymentApi.CaptureIntent)
	router.Post("/update", paymentApi.UpdateIntent)
}

func (a *HttpApp) loadAuthRoutes(router chi.Router) {
	authApi := handlers.AuthenticationApi{
		Ctx: a.ctx,
		App: a,
	}

	router.Post("/token", authApi.Authenticate)
}
