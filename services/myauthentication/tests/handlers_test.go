package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoginEndpoint(t *testing.T) {
	server, _, _ := CreateRecorder()
	defer server.Close()

	t.Run("Successful Login", func(t *testing.T) {
		// Simulate a successful login request
		req, _ := http.NewRequest("POST", server.URL+"/login", nil)

		recorder := httptest.NewRecorder()
		req.Write(recorder)

		server.Config.Handler.ServeHTTP(recorder, req)

		assert.Equal(t, http.StatusOK, recorder.Code, recorder.Body.String())
	})
}
