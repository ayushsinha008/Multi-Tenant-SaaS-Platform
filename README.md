# Multi-Tenant SaaS Platform

A production-ready Multi-Tenant SaaS platform built with a modern tech stack following Clean Architecture and SOLID principles.

## 🚀 Features

- **Multi-Tenant Architecture**: Complete data isolation between organizations.
- **Role-Based Access Control**: Granular permissions for Admins and Members.
- **Authentication**: Secure JWT-based auth with refresh tokens and HTTP-only cookies.
- **Real-Time Collaboration**: Live task updates and typing indicators using Socket.IO.
- **Comprehensive CRUD**: Manage Projects, Tasks, Members, and Organizations.
- **Advanced Task Management**: Drag & drop Kanban boards, priorities, due dates.
- **File Uploads**: Integrated with Cloudinary for seamless attachment handling.
- **Analytics Dashboard**: Overview cards and charts for monitoring workspace activity.
- **Background Jobs**: Automated daily summaries and reminders via Node Cron.
- **Security**: Rate limiting, Helmet, XSS protection, and Zod validation.

## 🛠 Tech Stack

### Frontend (apps/web)
- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **State Management**: Zustand, TanStack Query
- **Forms & Validation**: React Hook Form, Zod
- **Icons**: Lucide React

### Backend (apps/server)
- **Framework**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.IO
- **Security & Auth**: JWT, bcryptjs, Helmet, Express Rate Limit
- **Storage**: Cloudinary, Multer

## 📦 Project Structure (Monorepo)

```text
/
├── apps/
│   ├── web/          # Next.js 15 Frontend
│   └── server/       # Express + TypeScript Backend
├── packages/
│   ├── config/       # Shared config
│   ├── types/        # Shared types
│   ├── tsconfig/     # Base TS configurations
│   └── eslint-config/# Base linting rules
├── docker/           # Docker configurations
├── scripts/          # Automation scripts
└── docker-compose.yml
```

## ⚙️ Quick Start

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)
- MongoDB instance (local or Atlas)
- Cloudinary Account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd multi-tenant-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Copy the `.env.example` to `.env` in the root directory and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Servers**
   ```bash
   pnpm dev
   ```
   This command uses turbo/pnpm workspaces to start both the Next.js frontend (localhost:3000) and the Express backend (localhost:5000) in parallel.

## 🐳 Docker Deployment

To run the entire stack (MongoDB, Redis, Server, Web) via Docker Compose:

```bash
docker-compose up -d --build
```

## 📖 API Documentation
The API adheres to RESTful standards and requires a Bearer token or HTTP-only cookies for authentication. Most resources require the `x-tenant-id` header to ensure proper tenant isolation.

### Key Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/organizations`
- `GET /api/v1/projects`
- `GET /api/v1/tasks`
- `POST /api/v1/files/upload`
- `GET /api/v1/analytics`

## 🔒 Security
- All sensitive variables are handled securely via `.env`.
- Express Rate Limit prevents brute-force attacks.
- Passwords hashed via `bcryptjs`.
- Cross-Site Request Forgery (CSRF) and Cross-Site Scripting (XSS) protections included.
