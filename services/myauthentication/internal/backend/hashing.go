package backend

import (
	"crypto/sha256"
	"fmt"
)

func HashToSHA256(value string) string {
	encoder := sha256.New()
	encoder.Write([]byte(value))
	return fmt.Sprintf("%x", encoder.Sum(nil))
}
