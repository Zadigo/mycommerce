package models

import (
	"context"

	"github.com/redis/go-redis/v9"
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

type ServerConfigOptions struct {
	Ctx         context.Context
	ServerApp   ServerAppInterface
	RedisClient *redis.Client
	Debug       bool
}
