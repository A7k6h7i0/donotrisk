# DoNotRisk

Production-ready full-stack warranty intelligence platform with:
- Product and warranty catalog
- Warranty risk scoring
- OCR/QR extraction for warranty cards and invoices
- User dashboard with expiry tracking
- Admin management for categories, products, and warranty rules

## Monorepo Structure

```txt
DoNotRisk/
  frontend/        # Next.js + Tailwind UI
  backend/         # Express API + JWT + MongoDB
  ocr-service/     # FastAPI + Tesseract + OpenCV
  database/        # SQL schema and seed
  docker-compose.yml
```

## Quick Start (Docker)

1. Copy env files:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp ocr-service/.env.example ocr-service/.env
```
2. Start stack:
```bash
docker compose up --build
```
3. Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- OCR Service: `http://localhost:8000`
- MongoDB: `localhost:27017`

## Local Dev (Without Docker)

1. Start MongoDB and ensure database `donotrisk` is reachable.
2. Backend:
```bash
cd backend
npm install
npm run dev
```
3. OCR service:
```bash
cd ocr-service
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
4. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Security and Production Notes

- JWT auth with role-based authorization (`user`, `admin`)
- Password hashing via `bcrypt`
- HTTP hardening with `helmet`
- CORS allowlist via env
- Request rate limiting on auth routes
- SQL parameterization with `pg`
- Upload MIME/type checks and size limit
- OCR service isolated behind backend API

## Default Seed Credentials

- Admin: `admin@donotrisk.com` / `Admin@12345`
- User: `user@donotrisk.com` / `User@12345`

Change these immediately in production.

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/categories`
- `GET /api/categories/:id/products`
- `GET /api/products/:id`
- `POST /api/scans/extract` (auth)
- `POST /api/scans/save` (auth)
- `GET /api/users/me/warranties` (auth)
- `POST /api/admin/categories` (admin)
- `POST /api/admin/products` (admin)
- `POST /api/admin/warranties` (admin)
