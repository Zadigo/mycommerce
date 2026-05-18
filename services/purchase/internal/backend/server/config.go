package server

import "os"

type ServerConfig struct {
	RootDir string
	Port    string
}

func LoadConfig(rootDir string) *ServerConfig {
	return &ServerConfig{
		RootDir: rootDir,
		Port:    os.Getenv("GO_PORT"),
	}
}
