package tests

import (
	"os"
	"testing"

	"github.com/Zadigo/gopurchase/internal/backend/server"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestApp(t *testing.T) {
	godotenv.Load(".env")

	rootDir, err := os.Getwd()
	assert.NoError(t, err)

	app := server.NewApp(&server.ServerConfig{
		RootDir: rootDir,
		Port:    3000,
		YamlConfig: &server.YamlConfig{
			Redis: struct {
				Address string "yaml:\"address\""
			}{},
			Endpoints: []struct {
				Name string "yaml:\"name\""
				Url  string "yaml:\"url\""
			}{},
			Webhooks: []struct {
				Name      string "yaml:\"name\""
				Endpoints string "yaml:\"endpoints\""
				Url       string "yaml:\"url\""
			}{},
		},
	})
	t.Run("Should start application", func(t *testing.T) {
		err := app.Start(t.Context())
		t.Context().Done()
		assert.NotNil(t, err)
	})
}
