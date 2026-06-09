---
applyTo: "**/*"
description: "Use when editing any part of the project, including frontends, backends, services, and shared libraries."
---
# Project instructions

## Tech Stack

* Frontends: Nuxt 4 with Vue 3, TypeScript, and Nitro server engine
* Mobile: Flutter with Dart 3.0
* Backends: FastAPI or Django with Python 3.14
* Services: Golang with Go 1.20

## Repository structure

```text
mycommerce
|  |── frontends/
|  |   |── mainsite/
|  |   |  └── README.md
|  |   |── admin/
|  |   |  └── README.md
|  |── services/
|  |   |── addresses/
|  |   |  └── README.md
|  |   |── goauthentication/
|  |   |  └── README.md
|  |   |── gopurchase/
|  |   |  └── README.md
|  |   |── mycart/
|  |   |  └── README.md
|  |   |── myreviews/
|  |   |  └── README.md
|  |   |── mystore/
|  |   |  └── README.md
|  |   |── mysubscribers/
|  |   |  └── README.md
|  |── insfrastructure/
|  |   |── docker/
|  |   |── deployments/
└── README.md
```

* **frontends/** Contains the frontend applications, each in its own subdirectory (e.g., `mainsite`, `mobile`), generally written in Nuxt 4 with Vue 3, TypeScript, and Nitro server engine
  * **frontends/mainsite/** Main website frontend, generally written in Nuxt 4 with Vue 3, TypeScript, and Nitro server engine
  * **frontends/mobile/** Mobile application frontend, generally written in Flutter with Dart 3.0 (not always present in the repository)
* **services/** Backend applications, generally written in Python using FastAPI, Django or Golang for rapid development and rich ecosystem* **services/** Shared services that can be used across frontends and backends, such as authentication or database access, generally written in Golang with Go 1.20 for performance and concurrency benefits
  * **services/addresses/** Service for managing user addresses, generally written in Golang with Go 1.20
  * **services/goauthentication/** Service for handling authentication and authorization, generally written in Golang with Go 1.20
  * **services/gopurchase/** Service for processing purchases and orders, generally written in Golang with Go 1.20
  * **services/mycart/** Service for managing user shopping carts, generally written in Golang with Go 1.20
  * **services/myreviews/** Service for handling product reviews and ratings, generally written in Golang with Go 1.20
  * **services/mystore/** Service for managing store information and inventory, generally written in Golang with Go 1.20
  * **services/mysubscribers/** Service for managing user subscriptions and notifications, generally written in Golang with Go 1.20
* **infrastructure/** Contains infrastructure-related files and configurations, such as Dockerfiles and deployment scripts
  * **infrastructure/docker/** Dockerfiles and related configurations for containerizing the applications
  * **infrastructure/deployments/** Deployment scripts and configurations for deploying the applications to production

## Commands

- MyStore: `cd services/mystore && python manage.py runserver`
- MyStore tests: `cd services/mystore && pytest`
- Frontend dev server: `cd frontends/mainsite && pnpm dev`
- Frontend unit tests: `cd frontends/mainsite && pnpm test:unit`
- Frontend Nuxt tests: `cd frontends/mainsite && pnpm test:nuxt`
- Frontend e2e tests: `cd frontends/mainsite && pnpm test:e2e`
- Frontend lint: `cd frontends/mainsite && pnpm lint`
- Services GoPurchase: `cd services/gopurchase && go run main.go`
- Services GoAuthentication: `cd services/goauthentication && go run main.go`
- Services MyCart: `cd services/mycart && python manage.py runserver`
- Services MyReviews: `cd services/myreviews && python manage.py runserver`
- Services MySubscribers: `cd services/mysubscribers && python manage.py runserver`
- MCP Inspector: `npx @modelcontextprotocol/inspector uv --directory /path/to/mycommerce/mystore/ run manage.py stdio_server`
