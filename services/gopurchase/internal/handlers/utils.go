package handlers

import (
	"net/http"

	"github.com/Zadigo/gopurchase/internal/models"
	"github.com/Zadigo/gopurchase/internal/utils"
	"github.com/Zadigo/gopurchase/internal/utils/requests"
	"github.com/gorilla/websocket"
)

var CustomRequestUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(request *http.Request) bool {
		origin := request.Header.Get("Origin")

		_, ok := utils.AllowedOrigins[origin]
		if !ok {
			return false
		}

		return utils.AllowedOrigins[origin]
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
