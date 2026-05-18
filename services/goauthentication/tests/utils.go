package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/Zadigo/goauthentication/internal/backend"
	"github.com/Zadigo/goauthentication/internal/handlers"
	"github.com/stretchr/testify/assert"
)

func CreateRecorder(t *testing.T) *httptest.ResponseRecorder {
	projectPath, _ := os.Getwd()
	value, _ := strings.CutSuffix(projectPath, "/tests")
	serverConfig := backend.NewServerConfig(value)

	redisClient := backend.NewRedisClient(backend.RedisConfig{Address: "redis://@localhost:6379/0"})
	authBackend := backend.NewAuthenticationBackend(redisClient, serverConfig)

	body, _ := json.Marshal(map[string]string{
		"username": "testuser",
		"password": "testpass",
	})

	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	recorder := httptest.NewRecorder()
	handlers.LoginEndpoint(recorder, req, serverConfig, authBackend)

	assert.Equal(t, http.StatusOK, recorder.Code)

	return recorder
}
