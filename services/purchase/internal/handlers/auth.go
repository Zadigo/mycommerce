package handlers

import (
	"context"
	"net/http"

	"github.com/Zadigo/purchase/internal/models"
)

type AuthenticationApi struct {
	ServerConfig models.ServerConfigInterface
	Ctx          context.Context
}

func (a *AuthenticationApi) Authenticate(w http.ResponseWriter, r *http.Request) {}
