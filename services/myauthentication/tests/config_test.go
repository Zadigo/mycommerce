package tests

import (
	"os"
	"strings"
	"testing"

	"github.com/Zadigo/myauthentication/internal/backend"
	"github.com/stretchr/testify/assert"
)

func TestLoadConfig(t *testing.T) {
	projectPath, _ := os.Getwd()
	projectPath, _ = strings.CutSuffix(projectPath, "/tests")
	config := backend.NewServerConfig(projectPath)

	t.Run("Test if config is loaded correctly", func(t *testing.T) {
		assert.NotNil(t, config)
		assert.True(t, config.HasEndpoints())
	})
}
