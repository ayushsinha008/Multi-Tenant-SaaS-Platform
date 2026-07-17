# Deployment Guide — Omnistack (Multi-Tenant SaaS)

Deploy frontend on **Vercel** and backend on **Render**. MongoDB Atlas + Cloudinary are required.

---

## Prerequisites

- GitHub repo pushed (without `.env` — only `.env.example`)
- MongoDB Atlas cluster
- Cloudinary account
- (Optional) Firebase project for Google login

---

## 1. MongoDB Atlas

1. Create a cluster → **Database Access** → create a DB user
2. **Network Access** → Allow `0.0.0.0/0` (needed for Render)
3. Copy connection string → use as `MONGODB_URI`

---

## 2. Backend (Render)

1. [render.com](https://render.com) → **New** → **Web Service** → connect this GitHub repo
2. Settings:
   - **Root Directory:** leave empty (repo root)
   - **Runtime:** Node
   - **Build Command:**
     ```bash
     corepack enable && pnpm install --frozen-lockfile && pnpm --filter @saas/server build
     ```
   - **Start Command:**
     ```bash
     pnpm --filter @saas/server start
     ```

   If install fails with lockfile mismatch, temporarily use:
   `pnpm install --no-frozen-lockfile && pnpm --filter @saas/server build`
3. Add environment variables:

| Variable | Example / notes |
|----------|-----------------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render sets this automatically — you can omit) |
| `FRONTEND_URL` | `https://your-app.vercel.app` (no trailing slash) |
| `MONGODB_URI` | Atlas connection string |
| `JWT_ACCESS_SECRET` | long random string (32+ chars) |
| `JWT_REFRESH_SECRET` | different long random string |
| `JWT_ACCESS_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |

4. Deploy → open `https://YOUR-SERVICE.onrender.com/api/health`  
   Expect: `{ "status": "ok", "message": "API is healthy" }`

> Free Render services sleep after idle time — first request may take ~30–60s.

---

## 3. Frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Import** this GitHub repo
2. Settings:
   - **Root Directory:** `apps/web`
   - **Framework Preset:** Next.js
   - Enable **Include source files outside of the Root Directory** (needed for pnpm workspace)
   - **Install Command:** `cd ../.. && pnpm install`
   - **Build Command:** `pnpm build` (or leave default `next build`)
3. Environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-SERVICE.onrender.com/api/v1` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://YOUR-SERVICE.onrender.com` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `Omnistack` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | (optional — Google login) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | |

4. Deploy

---

## 4. Connect Frontend ↔ Backend

1. In Render, set `FRONTEND_URL` to your exact Vercel URL (e.g. `https://omnistack.vercel.app`)
2. Redeploy backend after changing it
3. Auth cookies use `SameSite=None; Secure` in production so cross-origin login works

---

## 5. Post-deploy checklist

- [ ] `GET /api/health` returns ok
- [ ] Register + login works from Vercel URL
- [ ] Create organization / workspace
- [ ] Create project + task
- [ ] File upload (Cloudinary)
- [ ] Socket connection (check browser Network → WS)
- [ ] Google login (only if Firebase env vars set)

---

## Security notes

- Never commit `.env` — only `.env.example`
- If `.env` was ever pushed, **rotate** MongoDB password, Cloudinary secret, PayU keys, and JWT secrets
- Keep `FRONTEND_URL` exact (scheme + host, no trailing slash) or CORS/cookies will fail
