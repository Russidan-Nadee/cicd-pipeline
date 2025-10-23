# CI/CD Pipeline Learning Project

A project for learning CI/CD Pipeline with GitHub Actions and Docker deployment

## About This Project

This is a simple NestJS REST API built for practicing and learning CI/CD Pipeline implementation with GitHub Actions. It covers the complete workflow from Continuous Integration (CI) to Continuous Deployment (CD), including building and pushing Docker images to Docker Hub.

## Tech Stack

### Backend Stack
- **NestJS** 11.0.1 - Progressive Node.js framework
- **Prisma** 6.17.1 - ORM for database
- **PostgreSQL** 15 - Relational database
- **TypeScript** 5.7.3
- **Jest** 30.0.0 - Testing framework

### CI/CD & DevOps
- **GitHub Actions** - CI/CD automation
- **Docker** - Containerization
- **Docker Hub** - Container registry

## CI/CD Pipeline Structure

The pipeline in [.github/workflows/backend.yml](.github/workflows/backend.yml) consists of 6 main jobs:

### 1. Install Dependencies
- Setup Node.js 20
- Install dependencies with `npm ci`
- Cache node_modules for use in other jobs

### 2. Lint Code
- Run ESLint to check code quality
- Use cached node_modules from install job
- Wait for install job to complete

### 3. Unit Tests
- Run unit tests with coverage report
- Use PostgreSQL service container for testing
- Generate Prisma Client and run migrations
- Upload coverage report as artifact

### 4. E2E Tests
- Run end-to-end tests
- Use separate PostgreSQL service container from unit tests
- Timeout: 15 minutes
- Upload E2E coverage report

### 5. Build Application
- Build NestJS project with `npm run build`
- Run after lint and all tests pass
- Upload build artifacts (dist/)

### 6. Docker Build & Push
- Run only when pushing to main branch
- Build Docker image with multi-stage build
- Push to Docker Hub: `russidan/cicd-pipeline-backend`
- Tags:
  - `latest` - for main branch
  - `main` - branch name
  - `main-{sha}` - commit SHA
- Use build cache for faster builds

## Pipeline Triggers

The pipeline runs when:
- **Push** to `main` or `develop` branch
- **Pull Request** to `main` or `develop` branch
- Changes to files in `backend/` or workflow file
- **Manual trigger** via workflow_dispatch

## Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Cancels in-progress workflows when a new push arrives (saves time and resources)

## Docker Multi-Stage Build

Dockerfile uses multi-stage build to reduce image size:

### Stage 1: Builder
- Install all dependencies (dev + production)
- Generate Prisma Client
- Build NestJS project

### Stage 2: Production
- Use production dependencies only
- Copy Prisma Client and dist from builder stage
- Smaller and more secure image

## Database Schema

Uses Prisma ORM with PostgreSQL, has 1 model:

**Item**
- `id` - Auto increment primary key
- `item` - String
- `createdAt` - Timestamp
- `updatedAt` - Auto-update timestamp

## Installation and Running

### Prerequisites
- Node.js 20+
- PostgreSQL 15
- Docker (if you want to run container)

### Installation

```bash
cd backend
npm install
```

### Setup Environment Variables

Create `.env` file in `backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### Run Database Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

### Run Development Server

```bash
npm run start:dev
```

API will run at `http://localhost:3000`

### Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Run Linter

```bash
npm run lint
```

### Build

```bash
npm run build
```

## Docker Deployment

### Build Docker Image

```bash
cd backend
docker build -t cicd-pipeline-backend .
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname" \
  cicd-pipeline-backend
```

## GitHub Secrets Configuration

For Docker deployment, you need to configure secrets:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add secrets:
   - `DOCKER_USERNAME` - Docker Hub username
   - `DOCKER_TOKEN` - Docker Hub access token

## What You'll Learn from This Project

### CI/CD Concepts
- ✅ Workflow triggers and conditions
- ✅ Job dependencies (`needs`)
- ✅ Caching strategies
- ✅ Service containers
- ✅ Artifacts management
- ✅ Concurrency control
- ✅ Secrets management

### Testing Strategies
- ✅ Unit testing with PostgreSQL
- ✅ E2E testing with separate environment
- ✅ Coverage reporting
- ✅ Test timeouts

### Docker Best Practices
- ✅ Multi-stage builds
- ✅ .dockerignore optimization
- ✅ Image caching
- ✅ Image tagging strategies
- ✅ Production-only dependencies

### DevOps Workflow
- ✅ Automated testing pipeline
- ✅ Build verification
- ✅ Automated deployment
- ✅ Container registry integration

## Project Structure

```
cicd-pipeline/
├── .github/
│   └── workflows/
│       └── backend.yml          # CI/CD Pipeline definition
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── src/
│   │   ├── items/               # Items CRUD module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                    # E2E tests
│   ├── Dockerfile               # Multi-stage Docker build
│   ├── .dockerignore
│   └── package.json
└── frontend/                    # Frontend (if applicable)
```

## API Endpoints

Backend has REST API for managing Items:

- `GET /items` - Get all items
- `GET /items/:id` - Get item by id
- `POST /items` - Create new item
- `PATCH /items/:id` - Update item
- `DELETE /items/:id` - Delete item

## License

UNLICENSED - For learning purposes only
