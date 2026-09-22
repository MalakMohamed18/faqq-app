# Faqqa Backend

<p align="center">
  <strong>Secure business-management API for Faqqa</strong><br />
  A modular NestJS backend for inventory, sales, finance, subscriptions, and AI-assisted business operations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeORM-Data%20Access-FE0803" alt="TypeORM" />
  <img src="https://img.shields.io/badge/JWT-Authentication-black?logo=jsonwebtokens" alt="JWT" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger&logoColor=black" alt="Swagger" />
</p>

Faqqa Backend is the API and data layer for the Faqqa business-management platform. It provides authenticated, business-scoped operations for small businesses and supplies verified data to the AI service for analytics and recommendations.

## Capabilities

- User registration, email OTP verification, JWT authentication, and business identity management.
- Subscription plans and business onboarding.
- Product catalog, inventory tracking, stock movements, low-stock monitoring, and product images.
- Sales, purchase invoices, purchase returns, and supplier workflows.
- Customer records, sales history, receivables, and outstanding balances.
- Expense tracking and financial summaries.
- Aggregated data endpoints for AI analysis and forecasting.
- AI text, voice, and image chat entry points.
- Cloudinary file uploads and SMTP email notifications.
- Swagger/OpenAPI documentation with bearer-token authorization.

## Architecture

```mermaid
flowchart LR
    C[Flutter / API Client] --> G[JWT Guard]
    G --> V[Validation Pipe]
    V --> K[NestJS Controllers]
    K --> S[Application Services]
    S --> R[TypeORM Repositories]
    R --> DB[(PostgreSQL)]
    S --> U[Cloudinary]
    S --> M[SMTP Provider]
    S --> AI[AI Service]
```

The application is organized as a modular NestJS monolith. Protected requests are associated with the authenticated business, DTOs are validated globally, and service-layer operations coordinate database writes and related business rules.

### Core Data ERD

The following ERD summarizes the main TypeORM entities and their relationships. `Business` is the tenant boundary for operational data, while sale and purchase item tables preserve line-level details.

```mermaid
erDiagram
  BUSINESS ||--o{ SUBSCRIPTION : has
  PLAN ||--o{ SUBSCRIPTION : defines
  BUSINESS ||--o{ PRODUCT : owns
  PRODUCT ||--o{ STOCK_MOVEMENT : records
  BUSINESS ||--o{ CUSTOMER : serves
  BUSINESS ||--o{ SALE : records
  CUSTOMER o|--o{ SALE : places
  SALE ||--|{ SALE_ITEM : contains
  PRODUCT o|--o{ SALE_ITEM : sold_as
  BUSINESS ||--o{ EXPENSE : tracks
  BUSINESS ||--o{ SUPPLIER : works_with
  BUSINESS ||--o{ PURCHASE_INVOICE : records
  SUPPLIER ||--o{ PURCHASE_INVOICE : provides
  PURCHASE_INVOICE ||--|{ PURCHASE_INVOICE_ITEM : contains
  PRODUCT o|--o{ PURCHASE_INVOICE_ITEM : purchased_as
  BUSINESS ||--o{ PURCHASE_RETURN : records
  SUPPLIER ||--o{ PURCHASE_RETURN : receives

  BUSINESS {
    uuid id PK
    string name
    string email
  }
  PLAN {
    uuid id PK
    string name
    decimal price
  }
  SUBSCRIPTION {
    uuid id PK
    uuid business_id FK
    uuid plan_id FK
    date start_date
    date end_date
  }
  PRODUCT {
    uuid id PK
    uuid business_id FK
    string name
    decimal price
    int stock
  }
  STOCK_MOVEMENT {
    uuid id PK
    uuid product_id FK
    int quantity
    string type
  }
  CUSTOMER {
    uuid id PK
    uuid business_id FK
    string name
    decimal balance
  }
  SALE {
    uuid id PK
    uuid business_id FK
    uuid customer_id FK
    decimal total
    date created_at
  }
  SALE_ITEM {
    uuid id PK
    uuid sale_id FK
    uuid product_id FK
    int quantity
    decimal unit_price
  }
  EXPENSE {
    uuid id PK
    uuid business_id FK
    decimal amount
    string category
    date date
  }
  SUPPLIER {
    uuid id PK
    uuid business_id FK
    string name
  }
  PURCHASE_INVOICE {
    uuid id PK
    uuid business_id FK
    uuid supplier_id FK
    decimal total
    date invoice_date
  }
  PURCHASE_INVOICE_ITEM {
    uuid id PK
    uuid invoice_id FK
    uuid product_id FK
    int quantity
    decimal unit_cost
  }
  PURCHASE_RETURN {
    uuid id PK
    uuid business_id FK
    uuid supplier_id FK
    decimal total
    date created_at
  }
```

## Project Structure

```text
src/
├── common/       Guards, decorators, interceptors, and shared services
├── config/       TypeORM and application configuration
├── modules/
│   ├── auth/          Registration, OTP verification, login, and JWT flows
│   ├── businesses/    Business profiles and onboarding
│   ├── plans/         Subscription plan definitions
│   ├── subscriptions/ Business subscriptions
│   ├── products/      Product catalog and inventory operations
│   ├── sales/         Sales and sale-item workflows
│   ├── purchases/     Purchases, suppliers, and purchase returns
│   ├── customers/     Customer data and receivables
│   ├── expenses/      Expense records and summaries
│   ├── ai-data/       Verified business data for AI tools
│   ├── ai-chat/       Text, voice, and image AI entry points
│   ├── uploads/       Cloudinary-backed file uploads
│   └── notifications/ Email delivery services
├── app.module.ts      Root module composition
└── main.ts            Application bootstrap and Swagger setup
```

## API Surface

The server runs with the following main route groups:

| Area | Base route | Purpose |
| --- | --- | --- |
| Authentication | `/api/auth` | Register, verify, login, and account access |
| Businesses | `/api/businesses` | Business profile and onboarding operations |
| Products | `/api/products` | Product and inventory management |
| Sales | `/api/sales` | Sales transactions and sales history |
| Purchases | `/api/purchases` | Purchase invoices, suppliers, and returns |
| Customers | `/api/customers` | Customers and receivables |
| Expenses | `/api/expenses` | Expense management and summaries |
| AI data | `/api/ai-data` | Controlled sales, inventory, finance, and forecast inputs |
| AI chat | `/api/ai/chat` | Authenticated text, voice, and image assistant requests |
| Uploads | `/api/uploads` | File upload operations |

All protected endpoints use a bearer JWT. Interactive documentation is available at `/api/docs` after the server starts.

## Requirements

- Node.js 20+
- npm
- PostgreSQL or a compatible hosted PostgreSQL database
- SMTP credentials for email verification
- Cloudinary credentials for file storage
- A running Faqqa AI service when using AI chat routes

## Getting Started

### Install

```bash
npm install
```

### Configure environment

Create `feqqa-backend/.env` locally:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=3000
JWT_SECRET=replace-with-a-long-secret
AI_SERVICE_URL=http://localhost:4000
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your-mail-user
MAIL_PASS=your-mail-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

`AI_SERVICE_URL` should point to the running AI API. Keep all credentials out of source control and use a separate secret-management strategy for production.

### Run

```bash
# Development with watch mode
npm run start:dev

# Production build and start
npm run build
npm run start:prod
```

Default URLs:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`

## AI Integration

The backend owns authentication and business context. The AI data module exposes controlled, verified data for the assistant instead of giving the model direct database access.

The backend AI controller currently supports:

- `POST /api/ai/chat` with a JSON message.
- `POST /api/ai/chat/voice` with an uploaded audio file.
- `POST /api/ai/chat/image` with an uploaded image and optional message.

The AI service currently exposes `POST /ai/chat` as its public chat endpoint. Some backend service methods still reference the older `/ai/voice`, `/ai/image`, and `/ai/analyze` protocol, so these flows should be treated as integration work in progress until both services share one contract.

## Development Commands

```bash
npm run start:dev    # Start the API in watch mode
npm run start:debug  # Start with the Node inspector
npm run build        # Compile to dist/
npm run start:prod   # Run the compiled application
npm run lint         # Run ESLint with auto-fix enabled
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Generate coverage output
npm run test:e2e     # Run end-to-end tests
npm run format       # Format source and test files
```

## Testing Strategy

- Unit tests live close to the NestJS source and use Jest with `ts-jest`.
- End-to-end tests use Jest and Supertest through `test/jest-e2e.json`.
- External services such as PostgreSQL, SMTP, Cloudinary, and the AI service should be configured when testing their integrations.

## Production Notes

- Replace development secrets and use strong, rotated JWT credentials.
- Confirm that every query is scoped to the authenticated business ID.
- Review `synchronize: true` in the TypeORM configuration before production deployment; migrations are safer for production data.
- Configure CORS, upload limits, logging, rate limiting, and secret management for the deployment environment.
- Keep the AI layer limited to explicit tools and validated contracts.

## Related Documentation

- [Root project overview](../README.md)
- [AI architecture and backend contract](../ai/Faqqa-AI-Documentation.md)
- [AI specification](../ai/feqqa_ai_spec.md)
- [Swagger UI](http://localhost:3000/api/docs) when the backend is running

## Team

**Aivora** - Building practical technology for smarter business management.

**Abdelrahman Mohie** - Backend Developer / Backend Lead.

## License

This project is private and currently not published under an open-source license.
