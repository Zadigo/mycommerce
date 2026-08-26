package requests

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

// SendRequest is a utility function to send an HTTP request with a JSON
// payload and decode the JSON response into the provided response struct.
func SendRequest[T any](requestUrl string, method string, data io.Reader, response T) error {
	urlInstance, err := url.Parse(requestUrl)
	if err != nil {
		return err
	}

	var client *http.Request
	switch method {
	case "GET":
		client, err = http.NewRequest(method, urlInstance.String(), nil)
	case "POST":
		client, err = http.NewRequest(method, urlInstance.String(), data)
	default:
		return &url.Error{Op: method, URL: requestUrl, Err: fmt.Errorf("unsupported method: %s", method)}
	}

	if err != nil {
		return err
	}

	client.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(client)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return &url.Error{Op: method, URL: requestUrl, Err: fmt.Errorf("unexpected status code: %d. %s", resp.StatusCode, string(body))}
	}

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return err
	}

	return nil
}
