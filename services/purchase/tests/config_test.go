package tests

import (
	"os"
	"strings"
	"testing"

	"github.com/Zadigo/purchase/internal/backend"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestLoadYamlConfig(t *testing.T) {
	err := godotenv.Load()
	assert.NoError(t, err)

	path, err := os.Getwd()
	if err != nil {
		t.Fatalf("Failed to get current working directory: %v", err)
	}
	rootDir := strings.TrimSuffix(path, "/tests")
	config := backend.NewServerConfig(rootDir)

	redisClient := backend.NewRedisClient()
	err = config.SetConfig(redisClient)
	assert.NoError(t, err)

	t.Run("Should load YAML config", func(t *testing.T) {
		assert.NoError(t, err)
		assert.Contains(t, config.GetConfig().Redis.Address, "localhost:6379")
	})

	t.Run("Should return endpoint URL", func(t *testing.T) {
		assert.NoError(t, err)
		endpointUrl := config.GetConfig().GetEndpoint("payment")
		assert.Equal(t, "http://127.0.0.1:8000/api/v1/", endpointUrl)
	})
}
