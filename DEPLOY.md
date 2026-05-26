# Deployment guide

Production URLs:

- **Store:** https://darling-daffodil-678558.netlify.app/
- **API:** https://chiliwebsite.onrender.com

---

## 1. MongoDB Atlas

1. Create a cluster and copy the connection string.
2. **Network Access** → allow `0.0.0.0/0` (or Render IP ranges) so the API can connect.
3. You will use this as `CONNECTION_STRING` on Render.

---

## 2. Prerequisites

- Code pushed to GitHub.
- Stripe keys (publishable for Netlify, secret for Render).
- Cloudinary + email credentials if you use those features.

Copy env templates:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
cp admin/.env.example admin/.env
```

---

## 3. Production deploy (Netlify + Render)

Follow these steps in order.

### 3.1 API on Render (Web Service)

**New → Web Service** (not Static Site) → connect this repo:

| Field | Value |
|--------|--------|
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `node app.js` |
| **Publish Directory** | *(leave empty)* |

**Environment variables** (see `server/.env.example`):

| Variable | Value |
|----------|--------|
| `CONNECTION_STRING` | MongoDB Atlas URL |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `JSON_WEB_TOKEN_SECRET_KEY` | your JWT secret |
| `cloudinary_Config_Cloud_Name` | Cloudinary |
| `cloudinary_Config_api_key` | Cloudinary |
| `cloudinary_Config_api_secret` | Cloudinary |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail or SMTP |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:3001,https://darling-daffodil-678558.netlify.app` |
| `FRONTEND_URL` | `https://darling-daffodil-678558.netlify.app` |

Deploy, then open https://chiliwebsite.onrender.com/ — expect:

```json
{"message":"Server is running!"}
```

Logs should include `Database connected`. If not, fix `CONNECTION_STRING` or Atlas network access.

### 3.2 Store on Netlify

Configured in `netlify.toml` (builds `client/`).

**Site configuration → Environment variables:**

| Variable | Value |
|----------|--------|
| `REACT_APP_API_URL` | `https://chiliwebsite.onrender.com` (also in `netlify.toml`) |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |

**Deploys → Trigger deploy → Clear cache and deploy site.**

Live site: https://darling-daffodil-678558.netlify.app/

### 3.3 Verify

1. Open https://darling-daffodil-678558.netlify.app/ — homepage loads with products.
2. API health: https://chiliwebsite.onrender.com/api/bootstrap/status
3. Home data: https://chiliwebsite.onrender.com/api/bootstrap/home
4. Browser devtools → Network — calls go to your Render URL, not `localhost:4000`.
5. Test sign-in, cart, and checkout.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `Publish directory npm start does not exist` | You created a **Static Site** on Render. Use **Web Service** (§3.1). |
| `Missing script: "start"` | Root Directory must be `server`, or use Start Command `node app.js`. |
| `Application exited early` | Set `CONNECTION_STRING` on Render; allow Atlas IPs. |
| Stripe crash on start | Set `STRIPE_SECRET_KEY` on Render. |
| API timeout / empty data | Set `CONNECTION_STRING` on Render; allow MongoDB Atlas `0.0.0.0/0`. Push latest server code and redeploy. |
| Site loads but no products | Set `REACT_APP_API_URL` on Netlify and redeploy with cache clear. |

---

## 4. Local development

```bash
# Terminal 1 – API
cd server && npm install && npm run dev

# Terminal 2 – store
cd client && npm install && npm start

# Terminal 3 – admin (optional)
cd admin && npm install && npm start
```

Local defaults (override in `client/.env` / `admin/.env`):

- API: `http://localhost:4000` for local server, or `https://chiliwebsite.onrender.com` for remote API
- Store: http://localhost:3000
- Admin: http://localhost:3001

Use `.env` files from the examples in each folder.
