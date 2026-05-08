package tests

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"

	"github.com/Zadigo/myauthentication/internal/backend"
	"github.com/Zadigo/myauthentication/internal/handlers"
)

func CreateRecorder() (*httptest.Server, *backend.ServerConfig, backend.AuthenticationInterface) {
	projectPath, _ := os.Getwd()
	value, _ := strings.CutSuffix(projectPath, "/tests")
	serverConfig := backend.NewServerConfig(value)

	redisClient := backend.NewRedisClient(backend.RedisConfig{Address: "redis://@localhost:6379/0"})
	authBackend := backend.NewAuthenticationBackend(redisClient, serverConfig)

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.LoginEndpoint(w, r, serverConfig, authBackend)
	}))

	return server, serverConfig, authBackend
}
