package backend

import (
	"os"

	"gopkg.in/yaml.v3"
)

type RedisConfig struct {
	Address  string `yaml:"redis_address"`
	Password string `yaml:"redis_password"`
	DB       int    `yaml:"redis_db"`
}

type MainConfi struct {
	// Configuration values for Redis
	Redis RedisConfig `yaml:"redis"`
	// The tartget endpoints for the authentication
	// service to manage tokens for
	Endpoints []string `yaml:"endpoints"`
}

type ServerConfig struct {
	Config MainConfi `yaml:"config"`
}

func (c *ServerConfig) HasEndpoints() bool {
	return len(c.Config.Endpoints) > 0
}

func LoadYamlConfig(path string) *ServerConfig {
	config := &ServerConfig{}

	fileName := os.Getenv("CONFIG_NAME")
	file, err := os.ReadFile(path + "/" + fileName)
	if err != nil {
		panic(err)
	}

	err = yaml.Unmarshal(file, config)
	if err != nil {
		panic(err)
	}

	return config
}
