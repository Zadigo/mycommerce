package tests

import (
	"encoding/json"
	"testing"
)

func TestLoginEndpoint(t *testing.T) {

	t.Run("Successful Login", func(t *testing.T) {
		recorder := CreateRecorder(t)

		body := json.NewDecoder(recorder.Body)
		var response struct {
			Token string `json:"token"`
		}
		err := body.Decode(&response)
		if err != nil {
			t.Fatalf("Failed to decode response body: %v", err)
		}
	})
}
