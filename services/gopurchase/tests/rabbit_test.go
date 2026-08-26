package tests

import (
	"testing"

	"github.com/Zadigo/gopurchase/internal/backend/rabbit"
	ampq "github.com/rabbitmq/amqp091-go"
	"github.com/stretchr/testify/assert"
)

func TestRabbitMqApp(t *testing.T) {
	app := rabbit.NewRabbitMqApp(t.Context())
	assert.NotNil(t, app)

	defer app.Close()

	t.Run("should be able to get queue", func(t *testing.T) {
		queue := app.GetQueue("test-queue")
		assert.NotNil(t, queue)
	})

	t.Run("should be able to publish message", func(t *testing.T) {
		err := app.Publish("test-queue", []byte("Hello, RabbitMQ!"))
		assert.NoError(t, err)

		t.Run("should be able to get message after publishing", func(t *testing.T) {
			app.Listen("test-queue", func(queueName string, response ampq.Delivery) {
				assert.Equal(t, "test-queue", queueName)
				assert.Equal(t, "Hello, RabbitMQ!", string(response.Body))
			})
		})
	})
}
