package handlers

import (
	"context"
	"net/http"

	"github.com/Zadigo/purchase/internal/backend/models"
)

type AuthenticationApi struct {
	ServerConfig models.ServerConfigInterface
	Ctx          context.Context
}

func (a *AuthenticationApi) Authenticate(w http.ResponseWriter, r *http.Request) {}
