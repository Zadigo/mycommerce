package ticker

import (
	"context"
	"errors"
	"fmt"

	"github.com/Zadigo/gopurchase/internal/utils"
)

type TickerErrors struct {
	utils.BaseErrorInterface
	ctx context.Context
}

func (e *TickerErrors) BasicError(err ...error) error {
	return errors.Join(err...)
}

func (e *TickerErrors) NoEndpointsError(err ...error) error {
	return fmt.Errorf("No endpoints defined in the YAML configuration file")
}

func (e *TickerErrors) EndpointError(name string, err ...error) error {
	return fmt.Errorf("Could not perform request for endpoint %s: %w", name, errors.Join(err...))
}

func (e *TickerErrors) CreateSchedulerError(name string, err ...error) error {
	return fmt.Errorf("Failed to create scheduler (%s): %w", name, errors.Join(err...))
}

func (e *TickerErrors) NoPaymentIntentKeysError(err ...error) error {
	return fmt.Errorf("⚠️ Failed to retrieve payment intent keys: %w", errors.Join(err...))
}

func (e *TickerErrors) IntentCaptureVerificationError(value string, err ...error) error {
	return fmt.Errorf("⚠️ Failed to verify payment intent %s capture status: %w", value, errors.Join(err...))
}

func (e *TickerErrors) IntentRetrievalError(value string, err ...error) error {
	return fmt.Errorf("⚠️ Failed to retrieve payment intent %s: %w", value, errors.Join(err...))
}

func NewTickerErrors(ctx context.Context) *TickerErrors {
	return &TickerErrors{
		ctx: ctx,
	}
}
