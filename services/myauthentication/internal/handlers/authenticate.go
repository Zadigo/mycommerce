package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Zadigo/myauthentication/internal/backend"
)

func LoginEndpoint(w http.ResponseWriter, r *http.Request, serverConfig *backend.ServerConfig, authenticationBackend backend.AuthenticationInterface) {
	body := json.NewDecoder(r.Body)
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	err := body.Decode(&credentials)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if credentials.Username == "" || credentials.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	// 1. Get the authentication token from the main endpoint
	authenticationTokens, err := authenticationBackend.Authenticate(credentials.Username, credentials.Password)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(authenticationTokens.MainToken.Token))

	log.Printf("✅ User '%s' authenticated successfully", credentials.Username)
}

func LogoutEndpoint(w http.ResponseWriter, r *http.Request, serverConfig *backend.ServerConfig, authenticationBackend backend.AuthenticationInterface) {
}

func VerifyEndpoint(w http.ResponseWriter, r *http.Request, serverConfig *backend.ServerConfig, authenticationBackend backend.AuthenticationInterface) {
}
