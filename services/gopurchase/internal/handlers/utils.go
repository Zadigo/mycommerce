package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"

	"github.com/Zadigo/gopurchase/internal/models"
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

// SendRequest is a utility function to send an HTTP request with a JSON
// payload and decode the JSON response into the provided response struct.
func SendRequest[T any](requestUrl string, method string, data io.Reader, response T) error {
	urlInstance, err := url.Parse(requestUrl)
	if err != nil {
		return err
	}

	var client *http.Request
	switch method {
	case "GET":
		client, err = http.NewRequest(method, urlInstance.String(), nil)
	case "POST":
		client, err = http.NewRequest(method, urlInstance.String(), data)
	default:
		return &url.Error{Op: method, URL: requestUrl, Err: err}
	}

	if err != nil {
		return err
	}

	client.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(client)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return err
	}

	return nil
}

func GetCartItems() ([]models.CartItem, error) {
	var cartItems []models.CartItem
	err := SendRequest("https://example.com/cart/items", "GET", nil, &cartItems)
	if err != nil {
		return nil, err
	} else {
		return cartItems, nil
	}

}
