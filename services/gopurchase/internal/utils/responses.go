package utils

import (
	"encoding/json"
	"net/http"
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
