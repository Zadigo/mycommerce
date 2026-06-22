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
    A[Nuxt] --> B(Backend)
    B --> C(EmailApi)

    C --> D(Database)
    C --> E(Cache)

    B --> F(Companies)
    F --> G(Database)
    F --> H(Cache)

    C --> I(Emailing server)
```

## System Workflow 🔄

*Explains the sequence of interactions between different components of the system, such as how a user request flows through the application, how data is processed, and how responses are generated. This can be illustrated using sequence diagrams or flowcharts.*

```mermaid
sequenceDiagram
    actor User
    participant Website
    participant EmailApi
    participant Database@{type: "database"}
    participant Redis@{type: "database"}
    participant Emailing server
    participant Lead@{type: "boundary"}

    rect rgb(167 213 255)
    User->>+Website: New campaign

    Website->>+EmailApi: Create campaign
    EmailApi-->>Database: Store campaign details
    EmailApi->>-User: Campaign created
    end

    User->>Website: Create leads
    Website->>+EmailApi: Create leads
    EmailApi-->>Database: Store lead details
    EmailApi->>-User: Leads created

    User->>Website: Create sequence
    Website->>+EmailApi: Create sequence
    EmailApi-->>Database: Store sequence details
    EmailApi->>-User: Sequence created

    User->>Website: Activate campaign
    Website->>EmailApi: Activate campaign
    EmailApi-->>Database: Update campaign status
    EmailApi-->>User: Campaign activated
    EmailApi-->>+Emailing server: New Emailing Job
    Emailing server->>EmailApi: Get campaign
    EmailApi->>Emailing server: Campaign Details
    Emailing server->>+Redis: Add job to queue
    Redis->>-Emailing server: Process job
    alt basic
    	Emailing server->>Lead: Send email
    else gmail
   	Emailing server->>Gmail server: Process email
	Gmail server->>Lead: Send email
    else outlook
	Emailing server->>Lead: Send email
    end
    Emailing server->>-Database: Update job status

    User->>()Website: Check jobs
    loop Every 1 minute
    Website()<<-->>()Emailing server: Request jobs
    end
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
