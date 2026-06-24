# Go Purchase Micro-Service 🎹

The purchase micro-service is a Golang server that accepts purchase requests from Nuxt 4 and syncs the purchase details with any backends decided by the developer. The reasoning behind this service is to allow the developer to implement any stock tracking backend and payment mechanism with the main shop interface.

## Process

1. When the user adds product in their cart, a payment intent is created. This payment intent is used to track the user during the shopping process

## Implementation & architecture

Here is the simplest technical implementation of how a payment process could take place:

```mermaid
flowchart

N(Nuxt) --> D(Django)
D <--> PG[(Database)]
D --> G(Golang)
G <--> R[(Redis)]
G <--> ST(Stripe)
G --> GC(Gocron)
GC --> D
```

Here is the detailed implementation of the payment process:

```mermaid
%% Example of sequence diagram
sequenceDiagram

autonumber

box Frontend
actor U as Alice
participant N@{type: "control"} as Nuxt
end

box Backend
participant D@{type: "control"} as Shop
participant G@{type: "control"} as Golang
participant S@{type: "control"} as Stock
end

box External
participant ST@{type: "boundary"} as Stripe
participant SH@{type: "boundary"} as Transporter
end

U ->> N: Click payment button
N ->> D: Start payment
D ->> G: Request payment

alt stock
G ->> S: Check stock
else
G ->> ()N: Product does not exist
end

alt Payment
G ->> ST: Try payment
ST ->> G: Payment successful
par shipment
ST -->> ()U: Email confirmation
G ->> SH: Create shipment
SH -->> D: Shipment created
D -->> ()U: Email confirmation
end
else Not found
ST -->> G: Payment failed
G -->> ()N: Payment failed
end

U ->> N: Check shipping info
N <<->> D: Track shipment
```

## Resources

* Stripe test cards [Stripe](https://docs.stripe.com/testing?testing-method=payment-methods#visa "Test cards")
