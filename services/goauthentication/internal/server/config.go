package server

type ServerConfig struct {
	RootDir    string
	Port       string
	YamlConfig *YamlConfig
}

func LoadConfig(rootDir string) *ServerConfig {
	return &ServerConfig{
		RootDir:    rootDir,
		Port:       "8000",
		YamlConfig: &YamlConfig{},
	}
}
