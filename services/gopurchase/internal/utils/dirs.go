package utils

import (
	"fmt"
	"path"
	"path/filepath"
)

func GetAbsolutePath(strPath string) (string, error) {
	absPath, err := filepath.Abs(strPath)
	if err != nil {
		return "", fmt.Errorf("❌ Failed to get absolute path: %v", err)
	}

	result := path.Ext(absPath)
	if result != "" {
		return "", fmt.Errorf("❌ Base directory should be a directory, got a file: %s", absPath)
	}

	return absPath, nil
}
