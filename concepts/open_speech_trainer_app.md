# Open Speech Trainer — Architecture & MVP Plan

## Introduction

The **Open Speech Trainer** is a language learning application that leverages AI to help users acquire vocabulary and practice with contextual sentences, with the possibility to expand into conversational training. Users select their source and target language and can either focus on vocabulary + sentence contexts or later engage in real dialogues. The system ensures efficiency by caching AI-generated results in a structured JSON schema stored in the database, avoiding unnecessary repeated requests. An admin function allows validation and review of stored data. The frontend will be a cross-platform Progressive Web App (PWA), while the backend will handle business logic, persistence, and AI orchestration.

## Architecture Overview

The application consists of the following main components:

* **Frontend (PWA)**: Cross-platform Progressive Web App for vocabulary and sentence lookups, later extended with conversation features.
* **Backend (NestJS)**: Acts as API Gateway and business logic layer in a monolithic but modular structure.

  * API Layer (Controllers, Guards, Pipes)
  * Services (Business logic)
  * Persistence Layer (Repositories for PostgreSQL)
  * Queue Integration (Redis or RabbitMQ)
* **Primary DB (PostgreSQL with JSONB)**: Stores user data, vocabulary, and contextual sentences in a structured and queryable format.
* **Cache (Redis, optional)**: Provides fast lookup for already generated vocabulary/sentences.
* **AI Worker**: Asynchronous jobs handling requests to external AI models, writing results back to cache & DB.

## UML Component Diagram (PlantUML)

```plantuml
@startuml

package "Frontend" {
  [PWA] 
}

package "Backend (NestJS)" {
  [API Gateway & Backend Logic]
}

package "Data Layer" {
  [PostgreSQL Primary]
  [Cache (Redis, optional)]
}

package "Worker" {
  [AI Worker]
}

[PWA] --> [API Gateway & Backend Logic]
[API Gateway & Backend Logic] --> [Cache (Redis, optional)]
[API Gateway & Backend Logic] --> [PostgreSQL Primary]
[API Gateway & Backend Logic] --> [AI Worker]
[AI Worker] --> [PostgreSQL Primary]
[AI Worker] --> [Cache (Redis, optional)]

@enduml
```

## UML Sequence Diagram (PlantUML)

```plantuml
@startuml

actor User
participant PWA
participant NestJS as API
participant Cache
participant DB as PostgreSQL
participant Worker

User -> PWA: Request word "house"
PWA -> API: GET /vocab?word=house
API -> Cache: Lookup "house"
alt Cache Hit
  Cache --> API: Vocabulary + context sentences
  API --> PWA: Response
else Cache Miss
  API -> Worker: Job "house" generation
  Worker -> External AI: Request
  Worker --> DB: Save vocabulary + contexts
  Worker --> Cache: Update with new data
  Worker --> API: Results
  API --> PWA: Response
end

@enduml
```

## Deployment with Docker Compose (MVP)

A simple setup for local development and MVP deployment:

```yaml
version: "3.8"
services:
  api:
    build: ./backend
    container_name: vocab_api
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      - POSTGRES_URI=postgres://postgres:password@postgres:5432/vocabapp
      - REDIS_URI=redis://redis:6379

  worker:
    build: ./worker
    container_name: vocab_worker
    depends_on:
      - postgres
      - redis
    environment:
      - POSTGRES_URI=postgres://postgres:password@postgres:5432/vocabapp
      - REDIS_URI=redis://redis:6379

  postgres:
    image: postgres:14
    container_name: vocab_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: vocabapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: vocab_redis
    ports:
      - "6379:6379"

  frontend:
    build: ./frontend
    container_name: vocab_frontend
    ports:
      - "8080:80"

volumes:
  postgres_data:
```

👉 This setup enables local development and quick testing.

## Production Setup (Example with Kubernetes + Managed Services)

For scalable production deployment:

* **Cluster Orchestration**: Kubernetes (e.g., AWS EKS, GCP GKE, or Azure AKS).
* **Backend (NestJS)** and **Worker**: Deployed separately with Horizontal Pod Autoscaler (HPA).
* **Frontend**: Served as static files via CDN (CloudFront, Netlify, Vercel) or Nginx-Ingress.
* **PostgreSQL**: Managed service (e.g., AWS RDS, Cloud SQL, or Azure Database for PostgreSQL).
* **Cache/Queue**: Managed Redis (e.g., AWS ElastiCache) or RabbitMQ as StatefulSet inside the cluster.
* **Ingress**: Nginx or Traefik with TLS (via cert-manager + Let’s Encrypt).
* **Monitoring & Logging**: Prometheus + Grafana, ELK stack, or cloud-native services.

### Example Kubernetes Deployment (simplified)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vocab-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vocab-api
  template:
    metadata:
      labels:
        app: vocab-api
    spec:
      containers:
      - name: api
        image: myrepo/vocab-api:latest
        ports:
          - containerPort: 3000
        env:
          - name: POSTGRES_URI
            value: postgres://postgres:password@postgres:5432/vocabapp
          - name: REDIS_URI
            value: redis://myredis:6379
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vocab-worker
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vocab-worker
  template:
    metadata:
      labels:
        app: vocab-worker
    spec:
      containers:
      - name: worker
        image: myrepo/vocab-worker:latest
        env:
          - name: POSTGRES_URI
            value: postgres://postgres:password@postgres:5432/vocabapp
          - name: REDIS_URI
            value: redis://myredis:6379
```

👉 This production setup uses scaling, managed services, and separation of concerns. The app can start small and grow massively.

## Roadmap MVP → Full

1. **MVP**

  * User can fetch vocabulary + context sentences.
  * Cache prevents duplicate AI requests.
  * Admin endpoint for validating and reviewing data.

2. **Next Steps**

  * Conversation mode (real dialogues).
  * Gamification (points, levels).
  * Multi-user + authentication.
  * Extended admin tools (review, corrections).

3. **Long-term**

  * Scaling via container orchestration (Kubernetes).
  * Offline mode for PWA.
  * Speech input & TTS.
  * Integration of additional AI models (e.g., Speech-to-Text).

## Competition Analysis & Differentiation

The language learning market is competitive, with popular apps like Duolingo, Babbel, and Memrise dominating. However, **Open Speech Trainer** offers differentiation:

* **Customizable AI-powered learning** instead of fixed content.
* **JSON schema + caching** ensures fast responses and consistency.
* **Admin validation** allows curated quality on top of AI.
* **Open-source roots** make it community-driven and transparent.

This unique positioning combines the flexibility of AI with the reliability of curated data.

## Monetization Strategies

As an open-source inspired project, sustainability is essential. Possible approaches include:

1. **Freemium model**: Basic vocabulary features free, premium subscription for advanced functions (conversation, TTS, offline mode).
2. **Premium features**: Custom AI tutoring, personal progress analytics, enterprise licensing for schools or training.
3. **API Layer**: Offer paid API access for developers to integrate vocabulary/context generation in their own apps.
4. **Community & Support**: Free open-source core, with paid support plans for institutions.

This balanced model allows accessibility while ensuring financial sustainability.
