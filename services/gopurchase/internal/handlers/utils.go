package handlers

import (
	"net/http"

	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/Zadigo/gopurchase/internal/utils/requests"
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

func GetCartItems() ([]models.CartItem, error) {
	var cartItems []models.CartItem
	err := requests.SendRequest("https://example.com/cart/items", "GET", nil, &cartItems)
	if err != nil {
		return nil, err
	} else {
		return cartItems, nil
	}

}
