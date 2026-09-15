# faqqa Backend

Backend service for **faqqa**, a smart business-management platform developed by **Aivora** for the IEEE Mansoura competition.

This repository contains the server-side application only. It provides the APIs and data layer used by the faqqa frontend to help small businesses manage their daily operations from one place.

## Core Capabilities

- Secure business registration, email OTP verification, and JWT authentication.
- Business profiles, subscription plans, and onboarding flow.
- Product catalog, inventory tracking, stock movements, and low-stock monitoring.
- Sales, purchase invoices, purchase returns, and supplier management.
- Customer records, receivables, and sales history.
- Expense tracking and monthly financial summaries.
- Aggregated business data for dashboards and AI-powered features.
- Cloudinary file uploads and email notifications.
- Swagger API documentation.

## Technology

- **NestJS 11** and **TypeScript**
- **PostgreSQL** with **TypeORM**
- **JWT** authentication and **bcrypt** password hashing
- **class-validator** request validation
- **Swagger/OpenAPI** API documentation
- **Nodemailer** for OTP emails
- **Cloudinary** for file storage
- **Jest** and **Supertest** for testing

## Architecture

The application is organized as a modular NestJS monolith:

```text
Client
  -> Controllers
  -> Guards and DTO validation
  -> Application services
  -> TypeORM repositories / database transactions
  -> PostgreSQL
```

Main modules include `auth`, `businesses`, `subscriptions`, `plans`, `products`, `sales`, `purchases`, `customers`, `expenses`, `ai-data`, `uploads`, and `notifications`.

Sales and inventory updates use database transactions to keep stock, sale items, and customer balances consistent. Protected routes require a bearer JWT and successful responses use a consistent response format.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- SMTP credentials for email verification
- Cloudinary credentials for uploads

### Installation

```bash
npm install
```

Create a `.env` file with the required environment variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=3000
JWT_SECRET=your-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Run

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API runs on `http://localhost:3000` by default. Interactive API documentation is available at `http://localhost:3000/api/docs`.

## Useful Commands

```bash
npm run build       # Compile the backend
npm run lint        # Check and fix lint issues
npm test            # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

## Team

**Aivora** - Building practical technology for smarter business management.

**Abdelrahman Mohie** - Backend Developer / Backend Lead.
