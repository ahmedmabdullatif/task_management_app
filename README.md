# Task Management App

![Task App Screenshot](./screenshot.png)

![App Demo](./demo.webp)

A simple 3-tier web application built for DevOps portfolio practice. Use this as a baseline to add Docker, Terraform, and CI/CD pipelines.

## Architecture

```
frontend/   → React (Vite)        → Port 5173
backend/    → Node.js + Express   → Port 5000
database/   → PostgreSQL          → Port 5432
```

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** running locally (or via Docker)

## Database Setup

1. Create a database called `taskdb`:
   ```bash
   createdb taskdb
   ```
2. Run the init script:
   ```bash
   psql -d taskdb -f database/init.sql
   ```

## Backend Setup

```bash
cd backend
cp .env.example .env   # Edit .env if your PG credentials differ
npm install
npm run dev            # Starts on http://localhost:5000
```

### API Endpoints

| Method | Endpoint         | Description       |
|--------|------------------|--------------------|
| GET    | /api/tasks       | List all tasks     |
| POST   | /api/tasks       | Create a new task  |
| DELETE | /api/tasks/:id   | Delete a task      |
| GET    | /health          | Health check       |

## Frontend Setup

```bash
cd frontend
npm install
npm run dev            # Starts on http://localhost:5173
```

The frontend reads `VITE_API_URL` from `frontend/.env` (defaults to `http://localhost:5000`).

## Environment Variables

### Backend (`backend/.env`)

| Variable  | Default     | Description             |
|-----------|-------------|--------------------------|
| PORT      | 5000        | Server port              |
| DB_HOST   | localhost   | PostgreSQL host          |
| DB_USER   | postgres    | PostgreSQL user          |
| DB_PASS   | postgres    | PostgreSQL password      |
| DB_NAME   | taskdb      | PostgreSQL database name |
| DB_PORT   | 5432        | PostgreSQL port          |

### Frontend (`frontend/.env`)

| Variable      | Default                  | Description       |
|---------------|--------------------------|-------------------|
| VITE_API_URL  | http://localhost:5000     | Backend API URL   |
