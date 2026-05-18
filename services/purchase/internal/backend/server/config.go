package server

import (
	"context"
	"errors"
	"log"
	"os"
	"regexp"
	"slices"
	"strings"

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

func (s *ServerConfig) LoadYamlConfig(ctx context.Context) error {
	filePath := s.RootDir + "/config.yaml"
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	err = yaml.NewDecoder(file).Decode(&s.YamlConfig)
	if err != nil {
		return err
	}
	log.Printf("🟢 Loaded YAML configuration from %s", filePath)

	endpointNames := []string{}

	allErrors := []error{}

	for _, endpoint := range s.YamlConfig.Endpoints {
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

		CheckUrl(endpoint.Url)
		endpointNames = append(endpointNames, endpoint.Name)
	}

	log.Printf("🔗 Endpoints: %v", endpointNames)

	for _, webhook := range s.YamlConfig.Webhooks {
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

		CheckUrl(webhook.Url)
	}

	log.Printf("🔗 Webhooks: %v", s.YamlConfig.Webhooks)

	if len(s.YamlConfig.Endpoints) == 0 {
		log.Print("⚠️ No endpoints found in YAML configuration")
	}

	if len(s.YamlConfig.Webhooks) == 0 {
		log.Print("⚠️ No webhooks found in YAML configuration")
	}

	if len(allErrors) > 0 {
		return errors.Join(allErrors...)
	}

	return nil
}

func (c *YamlConfig) GetEndpoint(name string) string {
	for _, endpoint := range c.Endpoints {
		if endpoint.Name == name {
			return endpoint.Url
		}
	}
	return ""
}

type ServerConfig struct {
	RootDir    string
	Port       uint
	YamlConfig *YamlConfig
}

func LoadConfig(rootDir string) *ServerConfig {
	return &ServerConfig{
		RootDir: rootDir,
		Port:    8000,
		YamlConfig: &YamlConfig{
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
