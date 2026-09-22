# Faqqa

<p align="center">
  <strong>AI-powered business management for small businesses</strong><br />
  Sales, inventory, receivables, expenses, forecasting, and Egyptian-Arabic assistance in one platform.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Flutter-3.x-02569B?logo=flutter&logoColor=white" alt="Flutter" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Ollama-Local%20LLM-black" alt="Ollama" />
</p>

Faqqa is a modular business-management platform designed to help shop owners understand and operate their businesses from a single workspace. The platform combines a Flutter application, a NestJS API, a controlled AI service, OCR and forecasting capabilities, and an Egyptian-Arabic voice prototype.

## Highlights

- JWT authentication, business accounts, plans, subscriptions, and email verification.
- Product catalog, inventory, stock movements, low-stock monitoring, sales, purchases, suppliers, customers, receivables, and expenses.
- AI intent classification with Ollama/Qwen, confidence validation, controlled tool routing, and Arabic response generation.
- Business insights, recommendations, cash-flow forecasting, demand forecasting, and business health scoring.
- Invoice/document OCR for images and PDFs using Tesseract, Sharp, Poppler, and PDF tooling.
- Egyptian-Arabic speech workflow using Whisper for speech-to-text and KemeTone/Kokoro for text-to-speech.
- Swagger/OpenAPI documentation and automated backend tests.

## Architecture

```mermaid
flowchart LR
    A[Flutter Client] --> B[NestJS Backend]
    B --> C[(PostgreSQL)]
    B --> D[AI Service]
    D --> E[Ollama / Qwen3]
    D --> B
    D --> F[OCR and Forecasting]
    G[Voice Prototype] --> H[TypeScript Bridge]
    H --> D
```

The backend and database are the source of truth. The AI layer interprets verified business data through controlled tools and should never invent financial or inventory figures.

## Repository Layout

```text
faqq-app/
├── ai/                 TypeScript AI service, tools, OCR, forecasts, and tests
├── feqqa-backend/      NestJS API, authentication, business modules, and database access
├── frontend/           Flutter application and feature screens
├── voice-new/          Python Egyptian-Arabic STT/TTS prototype
├── voice-ai-bridge.ts  CLI bridge used by the voice workflow
├── package.json        Root dependencies used by the bridge and shared tooling
└── tsconfig.json       Root TypeScript configuration
```

### AI Service (`ai/`)

The AI service exposes an Express API and orchestrates the complete assistant pipeline:

```text
User message
  -> Intent classifier
  -> Zod schema validation and confidence gate
  -> Tool router
  -> Verified backend data
  -> Insights / recommendations
  -> Egyptian-Arabic response generator
```

Important areas:

- `faqqa-ai.ts`: main orchestration pipeline.
- `intent_classifier.ts`, `prompts/`, `schemas/`: intent extraction and validation.
- `tool-router.ts`, `tools/`: controlled intent-to-data operations.
- `ocr/`: image/PDF processing, normalization, structuring, and validation.
- `contracts/forecasting/`, `contracts/cash-flow/`, `contracts/health-score/`: business analytics contracts and MVP calculations.
- `recommendations/`: actionable business recommendations.
- `server.ts`: `GET /health` and authenticated `POST /ai/chat`.

Supported assistant topics include daily and weekly sales, top products, low stock, receivables, expenses, business insights, demand forecasts, cash-flow forecasts, and business health score.

### Backend (`feqqa-backend/`)

The backend is a modular NestJS monolith using PostgreSQL and TypeORM. Its main modules are:

`auth`, `businesses`, `plans`, `subscriptions`, `products`, `sales`, `purchases`, `customers`, `expenses`, `ai-data`, `ai-chat`, `uploads`, and `notifications`.

It provides JWT-protected APIs, DTO validation, database transactions for business operations, Cloudinary uploads, SMTP email notifications, and Swagger documentation at `/api/docs`.

### Flutter Frontend (`frontend/`)

The mobile client uses Flutter with BLoC/Cubit state management. The current feature structure covers authentication and verification, the home dashboard, cash-flow screens, inventory dashboards, products, low-stock and out-of-stock views, product forms, and orders. It also includes speech input, charts, local preferences, custom Arabic-friendly fonts, and image picking.

### Voice Prototype (`voice-new/`)

The local voice loop records microphone input, transcribes Arabic with `faster-whisper`, normalizes Egyptian Arabic, calls `voice-ai-bridge.ts`, and speaks the response with KemeTone/Kokoro. This component is experimental and requires external model files, audio support, and `espeak-ng` configuration.

## Requirements

- Node.js 20+
- npm
- PostgreSQL
- Flutter SDK and Dart SDK
- Python 3.x for the voice prototype
- Ollama with the `qwen3:4b` model for local AI inference
- Poppler utilities for PDF OCR
- SMTP account and Cloudinary account for the backend integrations

## Local Setup

### 1. Install dependencies

```bash
# Root dependencies
npm install

# AI service
cd ai
npm install

# NestJS backend
cd ../feqqa-backend
npm install

# Flutter client
cd ../frontend
flutter pub get
```

### 2. Configure environment variables

Create environment files locally and never commit real credentials.

#### Backend (`feqqa-backend/.env`)

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

#### AI service / bridge

```env
PORT=4000
BACKEND_URL=http://localhost:3000/api
FEQQA_ACCESS_TOKEN=your-jwt-access-token
```

Start Ollama separately and make sure the configured model is available:

```bash
ollama pull qwen3:4b
```

### 3. Start the services

Run each service from its own terminal:

```bash
# Terminal 1: backend
cd feqqa-backend
npm run start:dev

# Terminal 2: AI service
cd ai
npm run dev

# Terminal 3: Flutter application
cd frontend
flutter run
```

Useful URLs:

- Backend API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`
- AI health check: `http://localhost:4000/health`
- AI chat: `POST http://localhost:4000/ai/chat`

Example AI request:

```bash
curl -X POST http://localhost:4000/ai/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"قولي مبيعات النهاردة"}'
```

## Commands

### AI service

```bash
cd ai
npm run typecheck
npm run build
npm run test:intent
npm run test:all
npm run test:real
```

### Backend

```bash
cd feqqa-backend
npm run build
npm test
npm run test:e2e
npm run lint
```

### Frontend

```bash
cd frontend
flutter analyze
flutter test
```

## Project Status

The core backend modules, AI pipeline, OCR components, recommendation engine, health score, and forecasting MVPs are implemented and covered by focused tests. The Flutter client currently contains the main product screens and local/fake data flows while backend wiring continues.

The AI/backend contract is actively being aligned. The current AI server exposes `/ai/chat`, while parts of the backend AI chat service still reference an older `/ai/voice`, `/ai/image`, and `/ai/analyze` protocol. Treat those routes as integration work in progress until the contract is unified.

The voice workflow is a prototype: model assets are not bundled, no Python dependency lockfile is currently provided, and `voice-new/voice_loop.py` contains a machine-specific project path that should be configured before use.

## Security Notes

- Keep database, JWT, SMTP, Cloudinary, and access-token secrets outside version control.
- Scope every AI request to the authenticated `business_id`.
- Validate OCR output before creating or updating business records.
- Keep the LLM behind controlled tools and never allow arbitrary database operations from model output.
- Review TypeORM `synchronize` settings before production deployment.

## Documentation

- [AI architecture and contracts](ai/Faqqa-AI-Documentation.md)
- [AI specification](ai/feqqa_ai_spec.md)
- [Backend documentation](feqqa-backend/README.md)
- [Backend Swagger UI](http://localhost:3000/api/docs) when the backend is running

## License

This project is private and currently not published under an open-source license.