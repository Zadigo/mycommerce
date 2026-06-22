package utils

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"
)

type DefaultErrorResponse struct {
	Detail  string `json:"detail"`
	Message string `json:"message"`
}

// JsonResponse is a helper function to send JSON responses with a given status code.
func JsonResponse[T any](w http.ResponseWriter, data T, statusCode int) {
	err := json.NewEncoder(w).Encode(data)

	if err != nil {
		// If encoding fails, send a generic error response
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
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
