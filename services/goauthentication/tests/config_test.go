package tests

import (
	"os"
	"testing"

	"github.com/Zadigo/goauthentication/internal/server"
	"github.com/stretchr/testify/assert"
)

func TestLoadConfig(t *testing.T) {
	projectPath, _ := os.Getwd()
	config := server.LoadConfig(projectPath)

	t.Run("Test if config is loaded correctly", func(t *testing.T) {
		assert.NotNil(t, config)
		// assert.True(t, config.HasEndpoints())
	})
}
