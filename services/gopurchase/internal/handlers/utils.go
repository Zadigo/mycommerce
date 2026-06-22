package handlers

import (
	"net/http"

	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/Zadigo/gopurchase/internal/utils"
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
func Cors(next http.Handler) http.Handler {
	fn := func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Access-Control-Allow-Origin", "*")
		response.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		response.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if request.Method == "OPTIONS" {
			response.WriteHeader(http.StatusOK)
			return
		}

		origin := request.Header.Get("Origin")
		if _, ok := allowedOrigins[origin]; !ok {
			http.Error(response, "Forbidden", http.StatusForbidden)
			return
		}

		next.ServeHTTP(response, request)
	}
	return http.HandlerFunc(fn)
}

func Authorization(next http.Handler) http.Handler {
	fn := func(response http.ResponseWriter, request *http.Request) {
		authHeader := request.Header.Get("Authorization")
		if authHeader == "" {
			// http.Error(response, "Unauthorized", http.StatusUnauthorized)
			// return
		}
	}
	return http.HandlerFunc(fn)
}

func GetCartItems() ([]models.CartItem, error) {
	var cartItems []models.CartItem
	err := utils.SendRequest("https://example.com/cart/items", "GET", nil, &cartItems)
	if err != nil {
		return nil, err
	} else {
		return cartItems, nil
	}

}
