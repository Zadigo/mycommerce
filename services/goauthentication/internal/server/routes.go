package server

import (
	"time"

	"github.com/Zadigo/goauthentication/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/v5/middleware"
)

func (a *App) loadRoutes() {
	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(middleware.Logger)

	router.Route("/authentication", a.loadAuthRoutes)
	a.router = router
}

func (a *App) loadAuthRoutes(r chi.Router) {
	authApi := handlers.AuthenticationApi{
		Ctx:         a.ctx,
		RedisClient: a.redisClient,
	}

	r.Post("/login", authApi.Login)
	r.Post("/logout", authApi.Logout)
	r.Post("/verify", authApi.Verify)
}
