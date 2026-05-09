package backend

import (
	"log"
	"os"

	"github.com/Zadigo/purchase/internal/backend/payment"
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
	Callbacks []struct {
		Name         string `yaml:"name"`
		ForEndpoints string `yaml:"for_endpoints"`
		Url          string `yaml:"url"`
	} `yaml:"callbacks"`
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

	for _, endpoint := range s.Config.Endpoints {
		if endpoint.Name == "" || endpoint.Url == "" {
			log.Printf("⚠️ Skipping invalid endpoint with empty name or URL: %+v", endpoint)
			continue
		}
		log.Printf("🔗 Endpoint: %s -> %s", endpoint.Name, endpoint.Url)
	}

	for _, endpoint := range s.Config.Callbacks {
		if endpoint.Name == "" || endpoint.Url == "" {
			log.Printf("⚠️ Skipping invalid callback with empty name or URL: %+v", endpoint)
			continue
		}
		log.Printf("🔗 Callback: %s -> [%s]", endpoint.Url, endpoint.ForEndpoints)
	}

	if len(s.Config.Endpoints) == 0 {
		log.Print("⚠️ No endpoints found in YAML configuration")
	}

	if len(s.Config.Callbacks) == 0 {
		log.Print("⚠️ No callbacks found in YAML configuration")
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
			Callbacks: []struct {
				Name         string `yaml:"name"`
				ForEndpoints string `yaml:"for_endpoints"`
				Url          string `yaml:"url"`
			}{},
		},
	}
}
