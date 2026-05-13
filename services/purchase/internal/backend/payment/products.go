package payment

import (
	"time"

	"github.com/stripe/stripe-go/v85"
)

type SizeItem struct {
	Name         string `json:"name"`
	Metric       string `json:"metric"`
	Active       bool   `json:"active"`
	Availability bool   `json:"availability"`
	VariantPrice int64  `json:"variantPrice"`
}

type ProductImage struct {
	Name        string `json:"name"`
	Variant     string `json:"variant"`
	Thumbnail   string `json:"thumbnail"`
	IsMainImage bool   `json:"isMainImage"`
	Original    string `json:"original"`
	// FIXME: From Django, send the full RFC date with
	// the time zone information not just the YYYY-MM-DD string
	CreatedOn time.Time `json:"-"`
}

type Product struct {
	// Sku       string       `json:"sku"`
	Id        string       `json:"id"`
	Name      string       `json:"name"`
	MainImage ProductImage `json:"mainImage"`
	// Selected SalePrice or UnitPrice based on whether
	// the product is on sale or not
	Price int64 `json:"price"`
	// The price of the product after any discounts.
	SalePrice int64 `json:"salePrice"`
	// The original price of the product before any discounts.
	UnitPrice int64 `json:"unitPrice"`
}

type CartItem struct {
	Size     SizeItem `json:"size"`
	Product  Product  `json:"product"`
	Total    int64    `json:"total"`
	Quantity int64    `json:"quantity"`
}

type CartItems struct {
	SessionId string     `json:"sessionId"`
	Items     []CartItem `json:"items"`
}

// CreateLineItems converts the CartItems into a slice of Stripe line item parameters. This is used to create
// line items in the payment intent and to provide detailed information about the purchase in the
// payment intent metadata.
func (c *CartItems) CreateLineItems() []*stripe.PaymentIntentCreateAmountDetailsLineItemParams {
	items := []*stripe.PaymentIntentCreateAmountDetailsLineItemParams{}
	for _, item := range c.Items {
		items = append(items, &stripe.PaymentIntentCreateAmountDetailsLineItemParams{
			Quantity:    &item.Quantity,
			ProductName: &item.Product.Name,
			UnitCost:    stripe.Int64(item.Product.UnitPrice * 100),
			// DiscountAmount: &item.Size.VariantPrice,
			// ProductCode: &item.Size.Name,
			UnitOfMeasure: &item.Size.Metric,
			// Tax: &stripe.PaymentIntentCreateAmountDetailsLineItemTaxParams{
			// 	TotalTaxAmount: stripe.Int64(0), // You can calculate tax based on your requirements and set it here
			// },
		})
	}
	return items
}

func (c *CartItems) UpdateLineItems() []*stripe.PaymentIntentUpdateAmountDetailsLineItemParams {
	items := []*stripe.PaymentIntentUpdateAmountDetailsLineItemParams{}
	for _, item := range c.Items {
		items = append(items, &stripe.PaymentIntentUpdateAmountDetailsLineItemParams{
			Quantity:    &item.Quantity,
			ProductName: &item.Product.Name,
			UnitCost:    stripe.Int64(item.Product.UnitPrice * 100),
			// DiscountAmount: &item.Size.VariantPrice,
			// ProductCode: &item.Size.Name,
			UnitOfMeasure: &item.Size.Metric,
			// Tax: &stripe.PaymentIntentUpdateAmountDetailsLineItemTaxParams{
			// 	TotalTaxAmount: stripe.Int64(0), // You can calculate tax based on your requirements and set it here
			// },
		})
	}
	return items
}
