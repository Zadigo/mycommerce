package tests

import (
	"bytes"
	"encoding/json"
	"testing"

	"github.com/Zadigo/purchase/internal/backend/utilities"
	"github.com/stretchr/testify/assert"
)

func TestSendRequest(t *testing.T) {
	data := map[string]any{}

	jsonData, _ := json.Marshal(data)
	reader := bytes.NewBuffer(jsonData)
	response := struct{}{}

	t.Run("Should send request", func(t *testing.T) {
		err := utilities.SendRequest("http://localhost:8080/payment", "POST", reader, &response)
		assert.NotNil(t, err)
	})
}
