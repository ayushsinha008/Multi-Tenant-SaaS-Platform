# Deployment Guide

This Multi-Tenant SaaS platform is designed to be highly scalable and is configured for deployment to modern PaaS providers.

## Backend (Render)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure the service:
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm --filter @saas/server build`
   - **Start Command**: `pnpm --filter @saas/server start`
4. Set the following Environment Variables in the Render dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=<Your MongoDB Atlas URI>`
   - `JWT_SECRET=<Secure Random String>`
   - `JWT_REFRESH_SECRET=<Secure Random String>`
   - `FRONTEND_URL=<Your Vercel URL>`
   - `CLOUDINARY_CLOUD_NAME=<Your Cloudinary Name>`
   - `CLOUDINARY_API_KEY=<Your Cloudinary API Key>`
   - `CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>`

## Frontend (Vercel)

1. Create a new **Project** on Vercel.
2. Connect your GitHub repository.
3. Vercel will automatically detect the Next.js framework.
4. Set the Root Directory to `apps/web` (or leave it as root and use Vercel's Monorepo support).
5. Set the Environment Variables:
   - `NEXT_PUBLIC_API_URL=<Your Render Backend URL>/api/v1`
   - `NEXT_PUBLIC_SOCKET_URL=<Your Render Backend URL>`

## Database (MongoDB Atlas)

1. Create a cluster on MongoDB Atlas.
2. Under Network Access, allow IPs `0.0.0.0/0` (or specifically Render's outbound IPs).
3. Copy the Connection String and set it as `MONGODB_URI` in Render.

## Storage (Cloudinary)

1. Create a Cloudinary account.
2. Navigate to the Dashboard to retrieve your Cloud Name, API Key, and API Secret.
3. Add these to your Render environment variables.
