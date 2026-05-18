package backend

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	neturl "net/url"

	"github.com/redis/go-redis/v9"
)

// ResponseToken represents the structure of the
// authentication token returned by the main endpoint
type ResponseToken struct {
	// Token is the authentication token string
	// that will be used for subsequent requests
	// to other services
	Token string `json:"token"`
}

// AuthenticationInterface defines the methods that
// any authentication backend must implement
type AuthenticationInterface interface {
	// Authenticate verifies the user's credentials on the main endpoint and then
	// will sync the authentication token with the remaining services
	Authenticate(username, password string) (string, *AuthenticationTokens, error)
	Logout(userID string) error
	GetTokens(userID string) *AuthenticationTokens
	GetRedisClient() *redis.Client
}

type AuthenticationTokens struct {
	MainToken        ResponseToken `json:"mainToken"`
	ShopToken        ResponseToken `json:"shopToken"`
	CartToken        ResponseToken `json:"cartToken"`
	ReviewsToken     ResponseToken `json:"reviewsToken"`
	SubscribersToken ResponseToken `json:"subscribersToken"`
}

// AuthenticationBackend is a concrete implementation
// of the AuthenticationInterface
type AuthenticationBackend struct {
	Tokens       map[string]*AuthenticationTokens
	redisClient  *redis.Client
	serverConfig *ServerConfig
}

func (a *AuthenticationBackend) GetRedisClient() *redis.Client {
	return a.redisClient
}

// Authenticate verifies the user's credentials and returns true if authentication is successful
func (a *AuthenticationBackend) Authenticate(username, password string) (string, *AuthenticationTokens, error) {
	// Hash the username and password to sha256 encoding that we will be using
	// as a key on Redis to store the authentication tokens for the user
	hashedUsername := HashToSHA256(username)
	hashedPassword := HashToSHA256(password)

	key := fmt.Sprintf("auth:%s:%s", hashedUsername, hashedPassword)

	backend := &AuthenticationTokens{}
	a.Tokens[key] = backend

	resultChannel := make(chan ResponseToken)

	sendRequest := func(url UrlEndpoint) {
		data := struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}{
			Username: username,
			Password: password,
		}

		body, err := json.Marshal(data)
		if err != nil {
			log.Printf("❌ Failed to marshal authentication request for service '%s': %v", url.Name, err)
			return
		}

		parsedUrl, err := neturl.Parse(url.Url)
		if err != nil {
			log.Printf("❌ Failed to parse URL for service '%s': %v", url.Name, err)
			return
		}

		client := &http.Client{}
		request := &http.Request{
			Method: "POST",
			URL:    parsedUrl,
			Body:   io.NopCloser(bytes.NewBuffer(body)),
			Header: http.Header{
				"Content-Type": []string{"application/json"},
			},
		}

		response, err := client.Do(request)
		if err != nil {
			log.Printf("❌ Authentication request failed for service '%s': %v", url.Name, err)
			return
		}

		if response.StatusCode != http.StatusOK {
			log.Printf("❌ Authentication failed for service '%s' with status code %d", url.Name, response.StatusCode)
			return
		}

		defer response.Body.Close()

		var result ResponseToken
		if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
			log.Printf("❌ Failed to decode authentication response for service '%s': %v", url.Name, err)
			return
		}

		if url.Name == "main" {
			backend.MainToken = result
		}

		resultChannel <- result
	}

	for _, url := range a.serverConfig.Config.Endpoints {
		go sendRequest(url)
	}

	allResults := <-resultChannel
	fmt.Print(allResults)

	// Implement authentication logic here
	return key, backend, nil
}

// Logout invalidates the user's authentication tokens
func (a *AuthenticationBackend) Logout(userID string) error {
	// Implement logout logic here
	return nil
}

// GetTokens retrieves the authentication tokens for a given user ID
func (a *AuthenticationBackend) GetTokens(userID string) *AuthenticationTokens {
	return a.Tokens[userID]
}

func NewAuthenticationBackend(redisClient *redis.Client, serverConfig *ServerConfig) AuthenticationInterface {
	return &AuthenticationBackend{
		redisClient:  redisClient,
		serverConfig: serverConfig,
		Tokens:       make(map[string]*AuthenticationTokens),
	}
}
