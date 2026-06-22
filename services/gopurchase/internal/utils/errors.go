package utils

type ErrorResponseInterface interface {
	ErrorWriter(message DefaultErrorResponse)
	JsonWriter(message DefaultErrorResponse, statusCode int)
	BasicError(errors ...error)
}
