package handlers

import (
	"net/http"

	"github.com/Zadigo/myauthentication/internal/backend"
)

func LoginEndpoint(w http.ResponseWriter, r *http.Request, authenticationBackend backend.AuthenticationInterface) {
}

func LogoutEndpoint(w http.ResponseWriter, r *http.Request, authenticationBackend backend.AuthenticationInterface) {
}
