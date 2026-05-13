package utilities

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"

	"github.com/Zadigo/purchase/internal/backend/payment"
)

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

func GetCartItems() ([]payment.CartItem, error) {
	var cartItems []payment.CartItem
	err := SendRequest("https://example.com/cart/items", "GET", nil, &cartItems)
	if err != nil {
		return nil, err
	} else {
		return cartItems, nil
	}

}

// CheckUrl validates the format of the provided URL string.
func CheckUrl(incomingUrl string) {
	_, err := url.ParseRequestURI(incomingUrl)
	if err != nil {
		panic("❌ Invalid URL format: " + incomingUrl)
	}
}
