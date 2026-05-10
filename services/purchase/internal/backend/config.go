package backend

import (
	"errors"
	"log"
	"os"
	"regexp"
	"slices"
	"strings"

	"github.com/Zadigo/purchase/internal/backend/payment"
	"github.com/Zadigo/purchase/internal/backend/utilities"
	"github.com/redis/go-redis/v9"
	"gopkg.in/yaml.v3"
)

type YamlConfig struct {
	Redis struct {
		Address string `yaml:"address"`
	} `yaml:"redis"`
	Endpoints []struct {
		Name string `yaml:"name"`
		Url  string `yaml:"url"`
	} `yaml:"endpoints"`
	Webhooks []struct {
		Name      string `yaml:"name"`
		Endpoints string `yaml:"endpoints"`
		Url       string `yaml:"url"`
	} `yaml:"webhooks"`
}

// GetEndpoint returns the URL of the endpoint with the given name
// from the YAML configuration.
func (c *YamlConfig) GetEndpoint(name string) string {
	for _, endpoint := range c.Endpoints {
		if endpoint.Name == name {
			return endpoint.Url
		}
	}
	return ""
}

type ServerConfig struct {
	RootDir       string
	redisClient   *redis.Client
	Config        *YamlConfig `yaml:"config"`
	stripeApiKey  string
	PaymentClient payment.PaymentInterface
}

type ServerConfigInterface interface {
	// SetConfig initializes the ServerConfig with the provided Redis client and
	// Stripe (or any other payment backend) API key from environment variables.
	// It also loads the YAML configuration from the config.yaml file.
	SetConfig(redisClient *redis.Client) error
	// GetRedisClient returns the initialized
	// Redis client for use in handlers and other components.
	GetRedisClient() *redis.Client
	// GetConfig returns the loaded YAML
	// configuration as a YamlConfig struct.
	GetConfig() *YamlConfig
	// GetPaymentApiKey returns the Stripe API key
	// (or any other payment backend API key)
	GetPaymentApiKey() string
	// GetPaymentClient returns the initialized payment
	// client that implements the PaymentInterface.
	GetPaymentClient() payment.PaymentInterface
}

func (s *ServerConfig) SetConfig(redisClient *redis.Client) error {
	s.redisClient = redisClient

	key := os.Getenv("STRIPE_API_KEY")
	if key == "" {
		log.Print("❌ STRIPE_API_KEY environment variable is not set")
	} else {
		client := payment.CreateStripeClient()
		s.PaymentClient = client
		log.Print("🟢 Payment client was successfully loaded...")
	}

	filePath := s.RootDir + "/config.yaml"
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	err = yaml.NewDecoder(file).Decode(s.Config)
	if err != nil {
		return err
	}
	log.Printf("🟢 Loaded YAML configuration from %s", filePath)

	endpointNames := []string{}

	allErrors := []error{}

	for _, endpoint := range s.Config.Endpoints {
		if endpoint.Name == "" || endpoint.Url == "" {
			log.Printf("⚠️ Skipping invalid endpoint with empty name or URL: %+v", endpoint)
			continue
		}

		if slices.Contains(endpointNames, endpoint.Name) {
			allErrors = append(allErrors, errors.New("❌ Duplicate endpoint name found in YAML configuration: "+endpoint.Name))
		}

		// Validate that the endpoint name only contains
		// lowercase letters, underscores, and hyphens
		state, err := regexp.Match("[a-z\\_\\-]+", []byte(endpoint.Name))
		if err != nil {
			allErrors = append(allErrors, errors.New("⚠️ Error while validating endpoint name format: "+endpoint.Name+", error: "+err.Error()))
		}

		if !state {
			allErrors = append(allErrors, errors.New("⚠️ Invalid endpoint name format: "+endpoint.Name))
		}

		utilities.CheckUrl(endpoint.Url)
		endpointNames = append(endpointNames, endpoint.Name)
	}

	log.Printf("🔗 Endpoints: %v", endpointNames)

	for _, webhook := range s.Config.Webhooks {
		if webhook.Name == "" || webhook.Url == "" {
			allErrors = append(allErrors, errors.New("⚠️ Skipping invalid webhook with empty name or URL: "+webhook.Name))
		}

		// Ensure that all endpoints referenced by the webhook
		// are defined in the endpoints list
		for token := range strings.SplitSeq(webhook.Endpoints, ",") {
			if !slices.Contains(endpointNames, token) {
				allErrors = append(allErrors, errors.New("❌ Webhook "+webhook.Name+" references undefined endpoint: "+token))
			}
		}

		utilities.CheckUrl(webhook.Url)
	}

	log.Printf("🔗 Webhooks: %v", s.Config.Webhooks)

	if len(s.Config.Endpoints) == 0 {
		log.Print("⚠️ No endpoints found in YAML configuration")
	}

	if len(s.Config.Webhooks) == 0 {
		log.Print("⚠️ No webhooks found in YAML configuration")
	}

	if len(allErrors) > 0 {
		return errors.Join(allErrors...)
	}

	return nil
}

func (s *ServerConfig) GetRedisClient() *redis.Client {
	return s.redisClient
}

func (s *ServerConfig) GetConfig() *YamlConfig {
	return s.Config
}

func (s *ServerConfig) GetPaymentApiKey() string {
	return s.stripeApiKey
}

func (s *ServerConfig) GetPaymentClient() payment.PaymentInterface {
	return s.PaymentClient
}

func NewServerConfig(rootDir string) ServerConfigInterface {
	return &ServerConfig{
		RootDir: rootDir,
		Config: &YamlConfig{
			Redis: struct {
				Address string `yaml:"address"`
			}{},
			Endpoints: []struct {
				Name string `yaml:"name"`
				Url  string `yaml:"url"`
			}{},
			Webhooks: []struct {
				Name      string `yaml:"name"`
				Endpoints string `yaml:"endpoints"`
				Url       string `yaml:"url"`
			}{},
		},
	}
}
