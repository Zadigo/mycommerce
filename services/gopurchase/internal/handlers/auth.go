package handlers

import (
	"context"
	"net/http"

	"github.com/Zadigo/gopurchase/internal/models"
)

type AuthenticationApi struct {
	Ctx context.Context
	App models.AppInterface
}

func (a *AuthenticationApi) Authenticate(w http.ResponseWriter, r *http.Request) {}
