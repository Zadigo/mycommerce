# Fullstack Emailing Platform Architecture

## Requirements & Assumptions 🟠

### Clarifying Questions

*Questions that need to be answered to better understand the requirements and constraints of the system*

- **Channels** Email ? SMS ? Push Notifications ?
- **User Authentication** Email/Password ? Social Login ?
- **Email Templates** Predefined ? Customizable ?
- **Email Scheduling** Immediate ? Scheduled ? Recurring ?
- **Email Personalization** Dynamic content based on user data ?
- **Email Tracking** Open rates ? Click-through rates ? Bounce rates ?
- **Spam protection** How to prevent the system from being used for spamming ? Rate limiting ? Email verification ? Prevent a same lead from receiving multiple emails in a short period of time ?
- **Sequences** How are the sequences managed for sending emails?

### Functional Requirements 🟢

*Describes the specific features and functionalities that the system must provide*

- **Admin** Dashboard for managing email campaigns, templates, and users.
- **Email Campaigns** Allows users to create, schedule, and manage email campaigns.
- **Email Sequences** Allows users to create multiple sequences of emails based on their marketing strategy (e.g. sequence one: cold reach, sequence two: follow up, sequence three: closing) and to send them on based on specific days differential (e.g. sequence 1 (day 1), sequence 2 (day 3), sequence 3 (day 7) etc
- **Email Templates** Provides predefined templates and allows customization for different campaigns.
- **Email Scheduling** Supports immediate, scheduled, and recurring email sending.
- **Email Personalization** Enables dynamic content based on user data.
- **Email Tracking** Tracks open rates, click-through rates, and bounce rates.
- **Spam Protection** Implements measures to prevent spamming, such as rate limiting and email verification.

## Capacity Planning ⏰

### Database

*Estimates the expected load on the system, such as the number of users, transactions, or requests per second. This helps in designing a system that can handle the anticipated traffic and scale as needed*

Estimation for one user campaign:

- **Leads** 100 leads per campaign
- **Emails** 3 emails per lead (cold reach, follow up, closing) [or 3 sequences]
- **Total emails** 300 emails per campaign
- **Campaigns** 2 campaigns per month
- **Total emails per month** 600 emails per month (2 x 300)
- **Total emails per year** 7 200 emails per year (300 x 12)
- **Database queries per second** Assuming each email requires 2 database queries (one for retrieving lead information and one for updating email status), the system would need to handle approximately 0.08 queries per second (7 200 emails per year / 31 536 000 seconds in a year).

### Storage

*Estimates the storage requirements for the system, such as the amount of data that needs to be stored and the growth rate over time. This helps in designing a system that can handle the anticipated storage needs and scale as required.*

## High Level Architecture 🏗️

*Describes the overall structure of the system, including the main components and how they interact with each other. This can be illustrated using diagrams such as component diagrams or architecture diagrams.*

```mermaid
flowchart

A[Nuxt] --> S(ShopApi)
A --> C(CartApi)

A --> G(Go-Payment)
S --> AW((AWS))

G --> R[(Redis)]

subgraph shop
S --> P[(PostGres)]
S --> R
C --> P
C --> R
end


G --> ST((Stripe))
```

## System Workflow 🔄

*Explains the sequence of interactions between different components of the system, such as how a user request flows through the application, how data is processed, and how responses are generated. This can be illustrated using sequence diagrams or flowcharts.*

```mermaid
sequenceDiagram

autonumber

actor U as User
participant W as Frontend
participant F@{type: "database"} as Firebase
participant DJ@{type: "entity"} as Django: Shop Api
participant SH@{type: "entity"} as Shipment Endpoint
participant D@{type: "database"} as Database
participant R@{type: "database"} as Redis
participant A@{type: "boundary"} as AWS
participant G@{type: "entity"} as Go-Payment
participant S@{type: "boundary"} as Stripe

U ->> W: Visit: /graphql
D ->> W: Return collections
U ->> W: Visit: /graphql
D ->> W: Return product
A ->> W: Return product images
U ->> W: Click add to cart
par save items
W ->> F: Add to cart
W ->> DJ: /v1/cart/add
end
DJ ->> ()D: Save to Postgres
U ->> W: /cart
U ->> W: /cart/shipment
U ->> W: /cart/payment
U ->> ()W: Do payment
W ->> G: Initiate payment
G ->> S: Run payment
S -->> G: Payment info

par payment workflow
S -->> U: Email user
G -->> R: Save payment info
G ->> DJ: Update Django
G ->> SH: Update shipment endpoint
G ->> W: Indicate success
end

W ->> U: /success
```

* Emailing service architecture: [services/goemailer/ARCHITECTURE.md](services/goemailer/ARCHITECTURE.md)

## Api Design 🛠️

*Describes the design of the APIs that will be used for communication between different components of the system, such as the frontend and backend. This includes the endpoints, request and response formats, authentication mechanisms, and any other relevant details about how the APIs will function.*

> Determines also whether the system will be using RESTful APIs or GraphQL, and how the frontend will interact with these APIs to fetch and manipulate data.
> If the system uses microservices architecture, the API design will also include details about how different microservices will communicate with each other, such as using RESTful APIs, gRPC, or message queues.

| Endpoint          | Method | Description                            | Request Body                                                          | Response Body                             |
| ----------------- | ------ | -------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| /graphql          | POST   | Retrieve a list of products            | { query: string, variables: object }                                  | List of products with details             |
| /graphql          | POST   | Retrieve details of a specific product | { query: string, variables: object }                                  | Product details                           |
| /graphql          | POST   | Add a product to the shopping cart     | { query: string, variables: object }                                  | Updated shopping cart details             |
| /graphql          | POST   | Process the checkout and payment       | { query: string, variables: object }                                  | Order confirmation and details            |
| /graphql          | POST   | Retrieve a list of user orders         | { query: string, variables: object }                                  | List of user orders with details          |
| /graphql          | POST   | Retrieve details of a specific order   | { query: string, variables: object }                                  | Order details                             |
| /api/v1/signup    | POST   | Register a new user                    | { username: string, password: string, password_confirmation: string } | User registration confirmation            |
| /auth/v1/token/   | POST   | Authenticate a user                    | { username: string, password: string }                                | Authentication token and user details     |
| /v1/auth/refresh  | POST   | Refresh authentication token           | { refresh_token: string }                                             | New authentication token and user details |
| /v1/token/verify/ | POST   | Verify authentication token            | { token: string }                                                     | Verification result                       |

## Data storage

*Describes how the system will store and manage data, including the choice of database (e.g., relational, NoSQL), data models, and how data will be accessed and manipulated by the application.*

### Amazon S3

*Explains the the manner in which the system will use Amazon S3 for storing and retrieving files, including the structure of the S3 buckets, access control policies, and how the application will interact with S3 for file uploads and downloads.*

### Database

*Explains the choice of database (e.g., relational, NoSQL) and how it will be used to store and manage data for the application. This includes the data models, relationships between entities, and how the application will perform CRUD (Create, Read, Update, Delete) operations on the database.*

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes
    CUSTOMER {
        string id
        string name
        string email
    }
    ORDER {
        string id
        date orderDate
        string status
    }
    PRODUCT {
        string id
        string name
        float price
    }
    ORDER_ITEM {
        int quantity
        float price
    }
```

## Caching

*Describes the caching strategy for the application, including what data will be cached, how it will be cached (e.g., in-memory cache, distributed cache), and how the cache will be invalidated when data changes. For example, product data that is frequently accessed but infrequently updated can be cached to improve performance and reduce load on the database.*

Caching will be almost exlusively done with Redis as an in-memory data store.

## Scalability

*Describes how the system will be designed to handle increasing loads and scale as needed. This includes strategies for horizontal scaling (adding more servers) and vertical scaling (upgrading existing servers), as well as any load balancing techniques that will be used to distribute traffic across multiple servers.*

```mermaid
    flowchart LR
        A[User Requests] --> B(Load Balancer)
        B --> C[EmailApi]
        B --> D[EmailApi]
        B --> E[EmailApi]
        E --> G[Emiling Server]
        E --> H[Emiling Server]
        E --> I[Emiling Server]
```

---

## References ⏰

*List of services and components that will be part of the system, along with their respective technologies and descriptions. This can be presented in a tabular format for clarity.*

| Service      | Language/Framework | Description                                                          |
| ------------ | ------------------ | -------------------------------------------------------------------- |
| EmailsApi    | Django             | Manages campaign/sequence creation and update                        |
| CompaniesApi | Django             | Manages information on leads                                         |
| GoSearcher   | Django             | Standalone server that queries official APIs for company information |
| Frontend     | Nuxt 4             | Renders the desktop user interface                                   |
| Subscribers  | Django             | Newsletters etc. management                                          |

## Technologies Used 🌳

*List of the main technologies used in the system, along with their purpose and version. This can help in understanding the technical stack of the application and how different components are implemented.*

| Technology        | Purpose/Usage            | Version |
| ----------------- | ------------------------ | ------- |
| Django            | Web framework            | ✅ 6.X  |
| PostgreSQL        | Database                 | ✅ 13.X |
| Redis             | Caching, message broker  | ✅ -    |
| RabbitMQ          | Message broker           | ✅ -    |
| Docker            | Containerization         | ✅ 20.X |
| Nuxt 4            | Frontend framework       | ✅ 4.X  |
| Firebase          | Authentication, database | ✅ -    |
| AWS S3            | Static and media storage | ✅ -    |
| Cloudfront        | CDN for static files     | ✅ -    |
| Google Analytics  | Traffic analysis         | ✅ -    |
| Facebook Pixels   | Traffic analysis         | ✅ -    |
| Microsoft Clarity | Traffic analysis         | ✅ -    |
