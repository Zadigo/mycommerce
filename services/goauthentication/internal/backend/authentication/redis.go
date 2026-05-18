package authentication

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

type AuthenticationClaims struct {
	jwt.MapClaims
	TokenType string `json:"token_type"`
	Exp       int64  `json:"exp"`
	Iat       int64  `json:"iat"`
	Jti       string `json:"jti"`
	UserId    string `json:"user_id"`
}

// AuthenticationRedis is a struct that implements the
// AuthenticationInterface using Redis as the backend for
// storing authentication tokens.
type AuthenticationRedis struct {
	redisClient *redis.Client   `json:"-"`
	ctx         context.Context `json:"-"`
	Access      string          `json:"access"`
	Refresh     string          `json:"refresh"`
}

func (a *AuthenticationRedis) convertToBase64(value string) string {
	encoder := sha256.New()
	encoder.Write([]byte(value))
	return fmt.Sprintf("%x", encoder.Sum(nil))
}

func (a *AuthenticationRedis) ParseAccess() (*AuthenticationClaims, error) {
	claims := &AuthenticationClaims{}
	token, err := jwt.ParseWithClaims(a.Access, claims, func(t *jwt.Token) (any, error) {
		return []byte(os.Getenv("DJANGO_SECRET_KEY")), nil
	})

	fmt.Print(os.Getenv("DJANGO_SECRET_KEY"))

	if err != nil {
		fmt.Printf("❌ Failed to parse access token: %v\n", err)
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid access token")
	}

	return claims, nil
}

func (a *AuthenticationRedis) GetTokens(ctx context.Context, username, password string) error {
	credentials := struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}{
		Username: username,
		Password: password,
	}
	jsonCredentials, err := json.Marshal(credentials)
	if err != nil {
		return fmt.Errorf("Failed to marshal credentials: %w", err)
	}

	request, err := http.NewRequest("POST", "http://127.0.0.1:8000/auth/v1/token/", bytes.NewBuffer(jsonCredentials))
	if err != nil {
		return fmt.Errorf("Failed to create request: %w", err)
	}

	request.Header.Set("Accept", "application/json")
	request.Header.Set("Content-Type", "application/json")

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return fmt.Errorf("Failed to send request: %w", err)
	}

	if response.StatusCode == http.StatusUnauthorized {
		return fmt.Errorf("Invalid username or password")
	}

	defer response.Body.Close()
	json.NewDecoder(response.Body).Decode(a)
	return nil
}

func (a *AuthenticationRedis) Save(ctx context.Context, username string) error {
	if a.Access == "" || a.Refresh == "" {
		fmt.Println("❌ Access and refresh tokens are required to save to Redis")
		return fmt.Errorf("access and refresh tokens are required")
	} else {
		err := a.redisClient.HSet(ctx, a.convertToBase64(username), "access", a.Access, "refresh", a.Refresh).Err()
		if err != nil {
			fmt.Printf("❌ Failed to save tokens to Redis: %v\n", err)
			return err
		}

		claims, err := a.ParseAccess()
		if err != nil {
			return err
		}
		a.redisClient.HSet(ctx, a.convertToBase64(username), "user_id", claims.UserId)

		expiration := time.Until(time.Unix(claims.Exp, 0))
		a.redisClient.HExpire(ctx, a.convertToBase64(username), expiration, "access")
	}
	return nil
}

func (a *AuthenticationRedis) Get(ctx context.Context, username, value string) (string, error) {
	cmd := a.redisClient.HGet(ctx, a.convertToBase64(username), value)
	if cmd.Err() != nil {
		fmt.Printf("❌ Failed to get value from Redis: %v\n", cmd.Err())
		return "", cmd.Err()
	}
	return cmd.Val(), nil
}

func (a *AuthenticationRedis) Delete(ctx context.Context, username string) (bool, error) {
	cmd := a.redisClient.Del(ctx, a.convertToBase64(username))
	if cmd.Err() != nil {
		fmt.Printf("❌ Failed to delete user from Redis: %v\n", cmd.Err())
		return false, cmd.Err()
	}
	return true, nil
}

func (a *AuthenticationRedis) Exists(ctx context.Context, username string) (bool, error) {
	cmd := a.redisClient.Exists(ctx, a.convertToBase64(username))
	if cmd.Err() != nil {
		fmt.Printf("❌ Failed to check if user exists in Redis: %v\n", cmd.Err())
		return false, cmd.Err()
	}

	return cmd.Val() == 1, nil
}

func NewAuthenticationRedis(ctx context.Context, redisClient *redis.Client) *AuthenticationRedis {
	return &AuthenticationRedis{
		redisClient: redisClient,
		ctx:         ctx,
	}
}
