package handlers

import (
	"errors"
	"net/http"

	"github.com/Zadigo/gopurchase/internal/utils"
)

type HttpErrors struct {
	utils.ErrorResponseInterface
	responseWriter http.ResponseWriter
}

func (e HttpErrors) JsonWriter(message utils.DefaultErrorResponse, statusCode int) {
	utils.JsonResponse(e.responseWriter, message, statusCode)
}

func (e HttpErrors) BasicError(errs ...error) {
	message := utils.DefaultErrorResponse{Detail: "An error occurred", Message: errors.Join(errs...).Error()}
	e.JsonWriter(message, http.StatusBadRequest)
}

func (e HttpErrors) InvalidBodyError(err error) {
	message := utils.DefaultErrorResponse{Detail: "Session ID is required", Message: "Please provide a valid session ID"}
	e.JsonWriter(message, http.StatusBadRequest)
}

func (e HttpErrors) PaymentIntentCreationError(err error) {
	message := utils.DefaultErrorResponse{Detail: "Failed to create payment intent", Message: err.Error()}
	e.JsonWriter(message, http.StatusBadRequest)
}

func (e HttpErrors) PaymentIntentMissingError(err error) {
	message := utils.DefaultErrorResponse{Detail: "Payment intent ID is required", Message: "Please provide a valid payment intent ID"}
	e.JsonWriter(message, http.StatusBadRequest)
}

func (e HttpErrors) PaymentIntentUpdateError(err error) {
	message := utils.DefaultErrorResponse{Detail: "Failed to update payment intent", Message: err.Error()}
	e.JsonWriter(message, http.StatusBadRequest)
}

func (e HttpErrors) PaymentIntentCaptureError(err error) {
	message := utils.DefaultErrorResponse{Detail: "Failed to capture payment intent", Message: err.Error()}
	e.JsonWriter(message, http.StatusBadRequest)
}

func NewHttpErrorHandler(w http.ResponseWriter) HttpErrors {
	return HttpErrors{
		responseWriter: w,
	}
}
