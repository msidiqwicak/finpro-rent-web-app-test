# Tools Used 


## Backend

- express (v5) — HTTP server
- @prisma/client, prisma, @prisma/adapter-pg — ORM untuk PostgreSQL / Prisma CLI
- bcryptjs — password hashing
- jsonwebtoken — JWT authentication
- cors — CORS middleware
- dotenv — environment variables
- zod — input validation
- multer — file upload handling
- cloudinary — image upload/storage
- qrcode — generate QR codes
- nodemailer — SMTP email sending
- winston — logging
- redis (redis) — local Redis client (listed in package.json)
- @upstash/redis — Upstash HTTP Redis client (dipakai di code)
- vercel — listed dependency (deployment)
- typescript, tsx — TypeScript & dev runner

## Frontend

- react, react-dom — UI library
- vite — dev server & build tool
- tailwindcss — styling
- postcss, autoprefixer — CSS tooling
- axios — HTTP client (with interceptors)
- chart.js, react-chartjs-2 — charts for analytics
- react-router-dom — routing
- react-hook-form, @hookform/resolvers — forms + zod integration
- zod — schema validation
- lucide-react — icons
- clsx, tailwind-merge — utilities for class names
- eslint (+ plugins) — linting
- typescript — static typing

## Database & Infra

- PostgreSQL (hosted on Supabase) — primary database
- Supabase — managed Postgres hosting / connection strings in repo
- Prisma — ORM & migrations
- Upstash Redis — cloud Redis (HTTP)
- Cloudinary — media storage
- Vercel — deployment (dependency present)

## Dev & Tooling

- TypeScript (`tsc`) — compile
- Vite — frontend build/dev
- tsx — run TS in dev
- Prisma CLI — generate/migrate/seed
- ESLint — code linting
- PostCSS / Autoprefixer

