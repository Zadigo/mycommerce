package utils

type ErrorResponseInterface interface {
	ErrorWriter(message DefaultErrorResponse)
	JsonWriter(message DefaultErrorResponse, statusCode int)
	BasicError(errors ...error)
}

type BaseErrorInterface interface {
	BasicError(errors ...error)
}
