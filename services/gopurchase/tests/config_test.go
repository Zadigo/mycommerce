package tests

import (
	"testing"

	"github.com/Zadigo/gopurchase/internal/server"
	"github.com/stretchr/testify/assert"
)

func TestLoadYamlConfig(t *testing.T) {
	config := &server.ServerConfig{
		RootDir: "..",
	}

	err := config.LoadYamlConfig(t.Context())

	t.Run("Should load YAML config", func(t *testing.T) {
		assert.NoError(t, err)
		assert.NotNil(t, config.YamlConfig)
		assert.NotEmpty(t, config.YamlConfig.Redis.Address)
		assert.Equal(t, "localhost:6379", config.YamlConfig.Redis.Address)
	})

	t.Run("Should return endpoint URL", func(t *testing.T) {
		assert.NoError(t, err)
		endpointUrl := config.YamlConfig.GetEndpoint("payment")
		assert.Equal(t, "http://127.0.0.1:8000/api/v1/", endpointUrl, endpointUrl)
	})

	t.Run("Should return error with wrong endpoints", func(t *testing.T) {
		endpointUrl := config.YamlConfig.GetEndpoint("wrong")
		assert.Empty(t, endpointUrl)
	})
}
