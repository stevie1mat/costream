# CoStream Signaling Server

WebRTC signaling server for the CoStream application.

## Quick Deploy

### Deploy to Render

1. Push this folder to a GitHub repository
2. Go to [render.com](https://render.com)
3. Create a new Web Service
4. Connect your repo
5. Use these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:5173`

### Deploy to Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Run: `railway login`
3. Run: `railway init`
4. Run: `railway up`

### Deploy to Heroku

```bash
heroku create costream-signaling-server
git push heroku main
```

## Local Development

```bash
npm install
npm start
```

Server runs on `http://localhost:3001`

## Environment Variables

- `PORT` - Port to run the server on (default: 3001)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (default: *)

## Health Check

Visit `http://your-server-url/` to see server status.
