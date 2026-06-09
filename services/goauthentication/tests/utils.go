package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Zadigo/goauthentication/internal/handlers"
)

func CreateRecorder(t *testing.T) *httptest.ResponseRecorder {
	apiHandler := handlers.AuthenticationApi{}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiHandler.Login(w, r)
	})

	recorder := httptest.NewRecorder()

	credentials, _ := json.Marshal(map[string]string{
		"username": "testuser",
		"password": "testpass",
	})

	buffer := bytes.NewBuffer(credentials)

	request := httptest.NewRequest("POST", "/login", buffer)
	request.Header.Set("Content-Type", "application/json")
	handler.ServeHTTP(recorder, request)
	return recorder
}
