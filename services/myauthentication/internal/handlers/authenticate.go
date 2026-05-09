package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/Zadigo/myauthentication/internal/backend"
	"github.com/golang-jwt/jwt/v5"
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
	key, authenticationTokens, err := authenticationBackend.Authenticate(credentials.Username, credentials.Password)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(authenticationTokens.MainToken.Token))

	// Create the JWT token that will be used for subsequent
	// requests to other services and store it in Redis
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":  "my-authentication-service",
		"sub":  credentials.Username,
		"auth": authenticationTokens,
	})
	_, err = token.SignedString([]byte("your-secret-key"))
	if err != nil {
		log.Printf("❌ Failed to sign JWT token: %v", err)
		return
	}

	authenticationBackend.GetRedisClient().Set(context.Background(), key, authenticationTokens, 0)

	log.Printf("✅ User '%s' authenticated successfully", credentials.Username)
}

func LogoutEndpoint(w http.ResponseWriter, r *http.Request, serverConfig *backend.ServerConfig, authenticationBackend backend.AuthenticationInterface) {
}

func VerifyEndpoint(w http.ResponseWriter, r *http.Request, serverConfig *backend.ServerConfig, authenticationBackend backend.AuthenticationInterface) {
}
