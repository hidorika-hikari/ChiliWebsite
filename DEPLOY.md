# Deployment guide

## 1. Frontend (Netlify)

Already configured in `netlify.toml`. Push to GitHub and Netlify will build `client/`.

**Netlify → Site configuration → Environment variables:**

| Variable | Example |
|----------|---------|
| `REACT_APP_API_URL` | `https://chili-api.onrender.com` (your live API URL, no trailing slash) |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |

Redeploy after setting variables.

Site: https://chili-website.netlify.app/

## 2. Backend (Render)

Use a **Web Service**, not a **Static Site**. Static sites have a “Publish directory” and will fail if you put `npm start` there.

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. Render → **New** → **Blueprint** → connect the repo (uses `render.yaml`).
3. Fill in secret env vars when prompted.

### Option B — Manual Web Service

Render → **New** → **Web Service** → connect repo, then:

| Field | Value |
|--------|--------|
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` (or `node app.js` if deploy fails before you push) |
| **Publish Directory** | *(leave blank — only for static sites)* |

**Important:** Push the latest code to GitHub first. Older commits have no `start` script in `server/package.json`. If you cannot push yet, set **Start Command** to `node app.js` with **Root Directory** `server`.

Do **not** use **New → Static Site** for the API.

### Troubleshooting: `Publish directory npm start does not exist`

You created a **Static Site** or put `npm start` in **Publish directory**. Delete that service, create a **Web Service** instead, and use the table above.

**Render env vars** (see `server/.env.example`):

- `CONNECTION_STRING` — MongoDB Atlas connection string
- `STRIPE_SECRET_KEY` — Stripe secret key (server only; `sk_test_...` or `sk_live_...`). Required for checkout. (`REACT_APP_STRIPE_SECRET_KEY` also works.)
- `CORS_ORIGINS` — include your Netlify URL
- `FRONTEND_URL` — Netlify URL (password-reset links)

## 3. Local development

```bash
# Terminal 1 – API
cd server && npm install && npm run dev

# Terminal 2 – store
cd client && npm install && npm start

# Terminal 3 – admin (optional)
cd admin && npm install && npm start
```

Copy `.env.example` → `.env` in each folder and fill in values.

## 4. MongoDB Atlas

- Allow network access: `0.0.0.0/0` (or Render’s IP ranges) so the hosted API can connect.
- In Render, env var must be named exactly **`CONNECTION_STRING`** (same value as in local `server/.env`).

### Troubleshooting: `Application exited early` after `Basic Route Registered`

The API used to exit if MongoDB failed to connect. Ensure **`CONNECTION_STRING`** is set on Render and Atlas allows external connections. After pushing the latest `server/app.js`, the server stays up even while DB connects; check logs for `Database connected` or `Database error`.
