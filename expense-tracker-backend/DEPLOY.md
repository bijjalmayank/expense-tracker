# Deployment guide

This document explains how to deploy the backend to Render (or similar) and required environment variables.

## Prerequisites
- A Git repo containing this project (pushed to GitHub/GitLab).
- A Render account (or other Node host) and access to the frontend deployment settings.

## Required environment variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `CLIENT_URL` — Frontend URL (no trailing slash), e.g. https://your-frontend.onrender.com
- `PORT` — optional, Render sets this automatically
- `NODE_ENV` — set to `production`

Note: `CLIENT_URL` is used by the CORS allowlist. Do NOT include a trailing slash.

## Render (Web Service) setup
1. On Render, create a new Web Service and connect your repository.
2. For the build command use: `npm install`
3. For the start command use: `npm start`
4. In Environment > Environment Variables, add the required variables above.
5. Optionally set a health check path to `/`.
6. Deploy — Render will run `npm install` and then `npm start`.

## Frontend (Vite) setup notes
- If deploying frontend to Vercel/Render, set the frontend's `VITE_API_BASE_URL` to the backend URL (no trailing slash) in the frontend project env settings.
- Example: `VITE_API_BASE_URL=https://expense-tracker-fdme.onrender.com`

## Verifying CORS and endpoints
1. Test preflight from your machine:

```bash
curl -i -X OPTIONS 'https://<your-backend>/auth/login' \
  -H 'Origin: https://your-frontend.example' \
  -H 'Access-Control-Request-Method: POST'
```

Response must include `Access-Control-Allow-Origin: https://your-frontend.example`.

2. Test login POST (example):

```bash
curl -i -X POST 'https://<your-backend>/auth/login' \
  -H 'Origin: https://your-frontend.example' \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"password"}'
```

## Troubleshooting
- If browser still shows CORS error, confirm `CLIENT_URL` exactly matches the `Origin` header (no trailing slash).
- Ensure the backend environment contains the same `CLIENT_URL` value used by the frontend.

## Local testing before deploy
- Set `.env` in backend with the variables above and run `npm run dev`.

---
If you want, I can (A) prepare a commit with this file and push, or (B) generate a `.render.yaml` or Dockerfile — tell me which.
