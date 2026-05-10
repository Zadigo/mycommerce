package utilities

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"
)

// SendRequest is a utility function to send an HTTP POST request with a JSON
// payload and decode the JSON response into the provided response struct.
func SendRequest[T any](requestUrl string, data io.Reader, response T) error {
	urlInstance, err := url.Parse(requestUrl)
	if err != nil {
		return err
	}

	client, err := http.NewRequest("POST", urlInstance.String(), data)
	if err != nil {
		return err
	}

	client.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(client)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return err
	}

	return nil
}

// CheckUrl validates the format of the provided URL string.
func CheckUrl(incomingUrl string) {
	_, err := url.ParseRequestURI(incomingUrl)
	if err != nil {
		panic("❌ Invalid URL format: " + incomingUrl)
	}
}
