package requests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type GraphQLRequest struct {
	Query     string         `json:"query"`
	Variables map[string]any `json:"variables,omitempty"`
}

type GraphQlRequestOptions struct {
	// Url is the endpoint URL for the GraphQL request.
	Url string
	// Method is the HTTP method to use for the request (e.g., "POST").
	Method string
	// Body is the GraphQL query or mutation to be sent in the request.
	Body string
	// Variables is an optional map of variables to be included in the GraphQL request.
	Variables map[string]any
	// AccessToken is the token used for authorization in the request header.
	AccessToken string
	// Bearer is the type of authorization
	Bearer string
}

func SendGraphqlRequest[T any](responseData T, options GraphQlRequestOptions) error {
	client := &http.Client{}

	graphqlBody := GraphQLRequest{
		Query: options.Body,
	}

	if options.Variables != nil {
		graphqlBody.Variables = options.Variables
	}

	jsonData, _ := json.Marshal(graphqlBody)
	request, err := http.NewRequest(options.Method, options.Url, bytes.NewBuffer(jsonData))

	if err != nil {
		return err
	}

	if options.Bearer == "" {
		options.Bearer = "Token"
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", fmt.Sprintf("%s %s", options.Bearer, options.AccessToken))
	resp, err := client.Do(request)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("GraphQL request failed with status code: %d. %s", resp.StatusCode, string(bodyBytes))
	}

	err = json.NewDecoder(resp.Body).Decode(&responseData)
	if err != nil {
		return fmt.Errorf("Failed to decode GraphQL response: %w", err)
	}

	return nil
}
