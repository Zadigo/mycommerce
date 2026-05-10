package stock

import (
	"bytes"
	"encoding/json"

	"github.com/Zadigo/purchase/internal/backend"
	"github.com/Zadigo/purchase/internal/backend/utilities"
)

type StockInterface interface {
	CheckStock(productID string) error
	UpdateStock(productID string, quantity int)
}

type CheckStockResponse struct {
	Product backend.Product `json:"product"`
	State   bool            `json:"state"`
}

func (s *CheckStockResponse) CheckStock(productID []string) error {
	data := CheckStockRequestData{
		Products: productID,
	}

	value, err := json.Marshal(data)
	if err != nil {
		return err
	}

	reader := bytes.NewReader(value)
	err = utilities.SendRequest("https://example.com/stock", reader, s)
	if err != nil {
		return err
	}

	s.State = true
	return nil
}

func (s *CheckStockResponse) UpdateStock(productID string, quantity int) {
	// 1. Send a request to the stock service to update the stock for the given product ID and quantity
}

type ShipmentInterface interface {
	CreateShipment(orderID string) error
}

type ShipmentResponse struct {
	OrderID string `json:"order_id"`
	State   bool   `json:"state"`
}

func (s *ShipmentResponse) CreateShipment(orderID string) {
	// 1. Send a request to the shipment service to create a shipment for the given order ID
}
