package server

import (
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type YamlConfig struct {
	Endpoints []struct {
		Name string `yaml:"name"`
		Url  string `yaml:"url"`
	} `yaml:"endpoints"`
}

func (s *YamlConfig) Load(rootDir string) error {
	filePath := rootDir + "/config.yaml"
	file, err := os.Open(filePath)

	if err != nil {
		return err
	}
	defer file.Close()

	err = yaml.NewDecoder(file).Decode(&s)
	if err != nil {
		return err
	}

	log.Printf("🟢 Loaded YAML configuration from %s", filePath)
	return nil
}
