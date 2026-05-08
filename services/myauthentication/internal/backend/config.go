package backend

import (
	neturl "net/url"
	"os"
	"slices"

	"gopkg.in/yaml.v3"
)

type RedisConfig struct {
	Address string `yaml:"redis_address"`
}

type UrlEndpoint struct {
	Name string `yaml:"name"`
	Url  string `yaml:"url"`
}

type MainConfig struct {
	// Configuration values for Redis
	Redis RedisConfig `yaml:"redis"`
	// The target endpoints for the authentication
	// service to manage tokens for
	Endpoints []UrlEndpoint `yaml:"endpoints"`
}

type ServerConfig struct {
	Config MainConfig `yaml:"config"`
}

func (c *ServerConfig) HasEndpoints() bool {
	return len(c.Config.Endpoints) > 0
}

func NewServerConfig(path string) *ServerConfig {
	config := &ServerConfig{
		MainConfig{
			Endpoints: []UrlEndpoint{},
			Redis: RedisConfig{
				Address: "",
			},
		},
	}

	// fileName := os.Getenv("CONFIG_NAME")
	fileName := "config.yaml"
	file, err := os.ReadFile(path + "/" + fileName)
	if err != nil {
		panic(err)
	}

	err = yaml.Unmarshal(file, config)
	if err != nil {
		panic(err)
	}

	seenNames := []string{}
	seenUrls := []string{}

	for _, endpoint := range config.Config.Endpoints {
		if endpoint.Name == "" || endpoint.Url == "" {
			panic("Invalid endpoint configuration: name and url are required")
		}

		// Ensure that endpoint names are unique to avoid
		// conflicts in token management
		if slices.Contains(seenNames, endpoint.Name) {
			panic("Invalid endpoint configuration: duplicate endpoint names are not allowed")
		}
		seenNames = append(seenNames, endpoint.Name)

		if slices.Contains(seenUrls, endpoint.Url) {
			panic("Invalid endpoint configuration: duplicate endpoint urls are not allowed")
		}
		seenUrls = append(seenUrls, endpoint.Url)

		// Check the URL format to ensure it's valid
		parsedUrl, err := neturl.Parse(endpoint.Url)

		if err != nil {
			panic("Invalid endpoint configuration: invalid URL format")
		}

		if parsedUrl.Scheme == "" || parsedUrl.Host == "" {
			panic("Invalid endpoint configuration: URL must include scheme and host")
		}
	}

	return config
}
