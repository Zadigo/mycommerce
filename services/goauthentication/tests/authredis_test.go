package tests

import (
	"testing"

	"github.com/Zadigo/goauthentication/internal/backend/authentication"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/assert"
)

func TestCorrectAuthenticationRedis(t *testing.T) {
	godotenv.Load("../.env", ".env")

	redisClient := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	authRedis := authentication.NewAuthenticationRedis(t.Context(), redisClient)

	t.Run("Authentication suite", func(t *testing.T) {
		t.Run("Should authenticate", func(t *testing.T) {
			err := authRedis.GetTokens(t.Context(), "zadigo", "touparet")
			assert.Nil(t, err)
			assert.NotEmpty(t, authRedis.Access)
			assert.NotEmpty(t, authRedis.Refresh)

			token, err := authRedis.ParseAccess()
			assert.Nil(t, err)
			assert.NotNil(t, token)
		})

		t.Run("Should save authentication tokens", func(t *testing.T) {
			err := authRedis.Save(t.Context(), "zadigo")
			assert.Nil(t, err)
		})

		t.Run("User should exist", func(t *testing.T) {
			exists, err := authRedis.Exists(t.Context(), "zadigo")
			assert.Nil(t, err)
			assert.True(t, exists)
		})

		t.Run("Should return the user", func(t *testing.T) {
			access, err := authRedis.Get(t.Context(), "zadigo", "access")
			assert.Nil(t, err)
			assert.NotEmpty(t, access)
		})

		t.Run("Should remove user", func(t *testing.T) {
			t.Skip("Works. We just skip to keep the tokens in Redis")
			authRedis.Delete(t.Context(), "zadigo")
			state, err := authRedis.Delete(t.Context(), "zadigo")
			assert.Nil(t, err)
			assert.True(t, state)
		})
	})
}
