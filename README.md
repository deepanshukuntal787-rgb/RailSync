# 🚆 IRCTC Clone

A scalable railway reservation platform inspired by IRCTC, built using a distributed microservices architecture with Node.js, PostgreSQL, Redis, Kafka, Elasticsearch, Docker, and a modern frontend.

---

## 📌 Features

### User Management
- User Registration
- Login & Authentication
- JWT Authorization
- Role-based Access Control

### Train Management
- Train CRUD Operations
- Station Management
- Schedule Management

### Booking System
- Ticket Booking
- Seat Reservation
- Booking Status Tracking
- Booking Cancellation

### Payments
- Payment Order Creation
- Payment Verification
- Refund Management
- Mock Gateway Support

### Search
- Fast Train Search
- Elasticsearch Integration

### Notifications
- Email Notifications
- Booking Updates

### Infrastructure
- Redis Caching
- Kafka Event Streaming
- Dockerized Services
- API Gateway Routing

---

# 🏗️ System Architecture

```text
                    ┌─────────────────┐
                    │    Frontend     │
                    │ Next.js / React │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   API Gateway   │
                    └────────┬────────┘
                             │
 ┌──────────────┬────────────┼────────────┬──────────────┐
 │              │            │            │              │
 ▼              ▼            ▼            ▼              ▼

User        Booking      Payment    Inventory      Search
Service     Service      Service    Service        Service

 │              │            │            │              │
 └──────────────┴────────────┴────────────┴──────────────┘
                             │
                             ▼
                   Notification Service
                             │
                             ▼
                       Admin Service
```

---

# 📂 Project Structure

```text
IRCTC-Clone/
│
├── frontend/
├── api-gateway/
├── user-service/
├── booking-service/
├── payment-service/
├── inventory-service/
├── search-service/
├── notification-service/
├── admin-service/
├── shared/
└── docker-compose.yml
```

---

# 🔧 Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js
- Prisma ORM

## Database
- PostgreSQL

## Cache
- Redis

## Event Streaming
- Apache Kafka

## Search Engine
- Elasticsearch

## Containerization
- Docker
- Docker Compose

---

# 🛠 Microservices

## API Gateway
- Request Routing
- Authentication Middleware
- Rate Limiting

## User Service
- User Registration
- Login
- JWT Authentication

## Booking Service
- Booking Creation
- Booking Management
- Seat Allocation

## Payment Service
- Payment Orders
- Payment Verification
- Refund Processing

## Inventory Service
- Seat Availability
- Inventory Updates

## Search Service
- Train Search
- Elasticsearch Queries

## Notification Service
- Email Notifications
- Booking Alerts

## Admin Service
- Train Management
- Schedule Management
- Station Management

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/deepanshukuntal787-rgb/IRCTC-Clone.git
cd IRCTC-Clone
```

## Start Infrastructure

```bash
docker compose up -d
```

## Install Dependencies

Run inside every service:

```bash
npm install
```

## Configure Environment

Create `.env` files from the provided examples:

```bash
cp .env.example .env
```

for all services.

## Run Services

```bash
npm run dev
```

Start:

- API Gateway
- User Service
- Booking Service
- Payment Service
- Inventory Service
- Search Service
- Notification Service
- Admin Service
- Frontend

---

# 🐳 Infrastructure Services

| Service | Port |
|----------|------|
| PostgreSQL | 5432 |
| Redis | 6379 |
| Kafka | 9093 |
| Zookeeper | 2181 |
| Elasticsearch | 9200 |
| Kibana | 5601 |
| Kafka UI | 8080 |
| pgAdmin | 8081 |

---

# 📊 Current Status

### Implemented

- Microservices Architecture
- API Gateway
- User Authentication
- Booking Workflow
- Payment Workflow
- Redis Integration
- Kafka Integration
- Elasticsearch Integration
- Docker Compose Setup
- Prisma ORM
- PostgreSQL

### In Progress

- End-to-End Integration Testing
- Production Deployment
- CI/CD Pipeline
- Monitoring & Observability

---
# Screenshots

## Home Page

![Home Page](./screenshots/WhatsApp%20Image%202026-08-16%20at%2017.26.14.jpeg)

# 👨‍💻 Author

Deepanshu Kuntal

GitHub:
https://github.com/deepanshukuntal787-rgb

---

# ⭐ Support

If you found this project useful, consider giving it a star.