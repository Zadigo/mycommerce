package rabbit

import (
	"context"
	"fmt"
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

// RabbitMqApp is a struct that holds the context,
// connection, and channel for RabbitMQ operations.
type RabbitMqApp struct {
	ctx  context.Context
	conn *amqp.Connection
	ch   *amqp.Channel
}

func (r *RabbitMqApp) Publish(queueName string, body []byte) error {
	queue := r.GetQueue(queueName)

	ctx, cancel := context.WithTimeout(r.ctx, 5*time.Second)
	defer cancel()

	err := r.ch.PublishWithContext(ctx, "", queue.Name, false, false, amqp.Publishing{
		ContentType: "text/plain",
		Body:        body,
	})

	if err != nil {
		return fmt.Errorf("Could not publish to queue: %w", err)
	}
	return nil
}

func (r *RabbitMqApp) GetQueue(name string) amqp.Queue {
	queue, err := r.ch.QueueDeclare(
		name,  // name
		true,  // durability
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		amqp.Table{
			amqp.QueueTypeArg: amqp.QueueTypeQuorum,
		},
	)

	if err != nil {
		panic(err)
	}

	return queue
}

func (r *RabbitMqApp) Close() {
	r.ch.Close()
	r.conn.Close()
}

func (r *RabbitMqApp) Listen(name string, listener func(queueName string, response amqp.Delivery)) error {
	msgs, err := r.ch.Consume(
		name,  // queue
		"",    // consumer
		true,  // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,   // args
	)

	if err != nil {
		return fmt.Errorf("Could not start listening to queue: %w", err)
	}

	chMessages := make(chan struct{})

	go func() {
		for d := range msgs {
			listener(name, d)
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-chMessages
	return nil
}

func NewRabbitMqApp(ctx context.Context) *RabbitMqApp {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		panic(err)
	}

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}

	return &RabbitMqApp{
		ctx:  ctx,
		conn: conn,
		ch:   ch,
	}
}
