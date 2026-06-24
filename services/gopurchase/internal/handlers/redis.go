package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/stripe/stripe-go/v85"
)

// PaymentRedis is a struct that provides
// methods to interact with Redis for payment-related operations.
// It allows the application to keep track of payment intents, session IDs,
// and other relevant data in a fast and efficient manner.
type PaymentRedis struct {
	ctx         context.Context
	redisClient *redis.Client
	storageKey  string
}

func (p *PaymentRedis) formatKey(intentID string) string {
	return fmt.Sprintf("%s:%s", p.storageKey, intentID)
}

// SetPaymentIntent stores a payment intent in Redis.
// It serializes the payment intent to JSON and saves it under a unique key.
// The payment intent is stored with an expiration time of 72 hours to ensure
// that old or unused intents are automatically cleaned up.
func (p *PaymentRedis) SetPaymentIntent(intent *stripe.PaymentIntent) error {
	b, err := json.Marshal(intent)
	if err != nil {
		return err
	}
	err = p.redisClient.HSet(p.ctx, p.formatKey(intent.ID), "captured", false, "response", b, "date", time.Now().Format(time.RFC3339)).Err()
	err2 := p.redisClient.Expire(p.ctx, p.formatKey(intent.ID), 72*time.Hour).Err() // Set expiration for the entire hash
	return errors.Join(err, err2)
}

// GetPaymentIntent retrieves a payment intent from Redis using its ID.
// It returns the payment intent if found, or an error if not found or if there was an issue with Redis.
func (p *PaymentRedis) GetPaymentIntent(intentID string) (*stripe.PaymentIntent, error) {
	data, err := p.redisClient.HGet(p.ctx, p.formatKey(intentID), "response").Result()
	if err != nil {
		return nil, err
	}

	var intent stripe.PaymentIntent
	if err := json.Unmarshal([]byte(data), &intent); err != nil {
		return nil, err
	}
	return &intent, nil
}

// DeletePaymentIntent removes the payment intent from Redis.
// This is useful for cleaning up old or completed payment intents to free up space in Redis.
func (p *PaymentRedis) DeletePaymentIntent(intentID string) error {
	return p.redisClient.Del(p.ctx, p.formatKey(intentID)).Err()
}

// UpdatePaymentIntent updates the stored payment intent in Redis.
// It overwrites the existing payment intent data with the new data provided.
// This method is useful when you need to update the payment intent's status or other details.
func (p *PaymentRedis) UpdatePaymentIntent(intent *stripe.PaymentIntent) error {
	b, err := json.Marshal(intent)
	if err != nil {
		return err
	}
	return p.redisClient.HSet(p.ctx, p.formatKey(intent.ID), "response", b).Err()
}

func (p *PaymentRedis) MarkPaymentIntentAsCaptured(intentID string) error {
	return p.redisClient.HSet(p.ctx, p.formatKey(intentID), "captured", true).Err()
}

func NewPaymentRedis(redisClient *redis.Client) *PaymentRedis {
	return &PaymentRedis{
		ctx:         context.Background(),
		redisClient: redisClient,
		storageKey:  "payment_intents", // This is the key under which payment intents will be stored in Redis.
	}
}
