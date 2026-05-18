package tests

import (
	"testing"

	"github.com/Zadigo/goauthentication/internal/backend"
	"github.com/stretchr/testify/assert"
)

func TestRedisClient(t *testing.T) {
	redisClient := backend.NewRedisClient(backend.RedisConfig{
		Address: "redis://@localhost:6379/0",
	})

	t.Run("Should return a valid client", func(t *testing.T) {
		assert.NotNil(t, redisClient)
	})

}
