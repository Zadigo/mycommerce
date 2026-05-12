package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/websocket"
)

var allowedOrigins = map[string]bool{
	"http://localhost:3000": true,
	"http://127.0.0.1:8000": true,
}

var CustomRequestUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(request *http.Request) bool {
		origin := request.Header.Get("Origin")

		_, ok := allowedOrigins[origin]
		if !ok {
			return false
		}

		return allowedOrigins[origin]
	},
}

// CORS middleware to handle cross-origin requests
func Cors(next http.HandlerFunc) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Access-Control-Allow-Origin", "*")
		response.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		response.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if request.Method == "OPTIONS" {
			response.WriteHeader(http.StatusOK)
			return
		}

		next(response, request)
	}
}

type DefaultErrorResponse struct {
	Detail  string `json:"detail"`
	Message string `json:"message"`
}

// JsonResponse is a helper function to send JSON responses with a given status code.
func JsonResponse[T any](w http.ResponseWriter, data T, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		// If encoding fails, send a generic error response
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}
