package server

import "net/url"

// CheckUrl validates the format of the provided URL string.
func CheckUrl(incomingUrl string) {
	_, err := url.ParseRequestURI(incomingUrl)
	if err != nil {
		panic("❌ Invalid URL format: " + incomingUrl)
	}
}
