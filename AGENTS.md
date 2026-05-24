# AGENTS.md

## Scope

These instructions apply to the whole workspace. Use them with the path-scoped files in `.github/instructions/`.

## Repository Shape

- [mystore/](mystore/) is the Django backend for the e-commerce project responsible for product management, order processing, and user authentication. It exposes REST endpoints under `/api/`, GraphQL under `/graphql/`, and async tasks through Celery.
- [frontend/](frontend/) contains all the frontend applications for the project:
    - [mainsite/](frontend/mainsite/) is the Nuxt 3 application for the main e-commerce website. It communicates with the backend over HTTP and websockets and uses selective SSR through `routeRules`.
    - [admin/](frontend/admin/) is the React application for the admin dashboard, which also interacts with the backend APIs.
- [mobile/](mobile/) contains two applications for the mobile experience:
    - [mobile/nuxtmobile/](mobile/nuxtmobile/) which is a Ionic Nuxt 4 application for both iOS and Android devices.
    - [mobile/mymobile/](mobile/mymobile/) is Flutter application for both iOS and Android devices.
- [docker-compose.yaml](docker-compose.yaml) documents the deployed service wiring and the backend container port.
- [README.md](README.md) and [mainsite/README.md](mainsite/README.md) contain the high-level architecture and domain language for the project, which should be used as a reference for understanding the backend and frontend concepts.
- [services/](services/) contains all the micro-services use to enhance the main Django backend. Each micro-service has its own README file for the service-specific architecture and domain language.
    - [services/addresses/](services/addresses/) is a FastApi micro-service responsible querying addresses (cities, states, countries).
    - [services/goauthentication/](services/goauthentication/) is a Golang micro-service responsible for user authentication and authorization, providing JWT tokens for secure communication between the frontend and backend.
    - [services/gopurchases/](services/gopurchases/) is a Golang micro-service responsible for handling purchase transactions, including payment processing and order fulfillment.
    - [services/mycart/](services/mycart/) is Django based micro-service responsible for managing user shopping carts, including adding, updating, and removing items from the cart.
    - [services/myreviews/](services/myreviews/) is Django based micro-service responsible for managing user reviews, including adding, updating, and deleting reviews.
    - [services/mysubscribers/](services/mysubscribers/) is Django based micro-service responsible for managing subscribers, including adding, updating, and removing subscribers.
- [deployments/](deployments/) contains all the deployment configuration files for Kubernetes, including the backend and frontend deployment manifests, service definitions, and ingress configurations.
- [docker/](docker/) contains all the Dockerfiles for the backend and frontend applications, as well as any additional services that require containerization. It contains [docker/environment/](docker/environment/) files useful for each service

## First References

- Start with the project [README.md](README.md) for the product overview and high-level architecture.
- Use [mainsite/README.md](mainsite/README.md) for frontend-specific concepts and architecture.
- Use [mystore/README.md](mystore/README.md) for product concepts such as tables, relationships, triggers, functions, and constraints. The backend is divided into 5 main apps: `accounts`, `collection`, `shop`, `stocks`, and `variants`.
- Use [docker-compose.yaml](docker-compose.yaml) when you need deployment domains, env files, or mounted paths.

## Working Commands

- Backend dev server: `cd mystore && python manage.py runserver`
- Backend tests: `cd mystore && pytest`
- Frontend dev server: `cd frontend/mainsite && pnpm dev`
- Frontend unit tests: `cd frontend/mainsite && pnpm test:unit`
- Frontend Nuxt tests: `cd frontend/mainsite && pnpm test:nuxt`
- Frontend e2e tests: `cd frontend/mainsite && pnpm test:e2e`
- Frontend lint: `cd frontend/mainsite && pnpm lint`
- Services GoPurchase: `cd services/gopurchases && go run main.go`
- Services GoAuthentication: `cd services/goauthentication && go run main.go`
- Services MyCart: `cd services/mycart && python manage.py runserver`
- Services MyReviews: `cd services/myreviews && python manage.py runserver`
- Services MySubscribers: `cd services/mysubscribers && python manage.py runserver`
- MCP Inspector: `npx @modelcontextprotocol/inspector uv --directory /path/to/mycommerce/mystore/ run manage.py stdio_server`

## Repo Conventions

- Keep backend API changes versioned under `/v1/`.
- Treat Django model changes as cross-cutting: check the app's `api/`, `graphql/`, `tests/`, and websocket or task modules when relevant.
- Preserve REST and GraphQL behavior together when a backend domain model changes.
- Do not change websocket authentication or ASGI wiring casually. Read the existing backend websocket setup before touching it.
- Keep frontend changes aligned with the backend domain language from the README files: databases contain tables, and table behavior includes relationships, triggers, functions, constraints, and windows.

## Validation Strategy

- Prefer focused validation from the touched area before running broad suites.
- For backend-only changes, run `pytest` from `mystore/`.
- For frontend-only changes, run the narrowest matching script from `mainsite/package.json`.
