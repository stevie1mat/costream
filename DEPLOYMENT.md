# Deployment Guide for CoStream

## Overview
CoStream requires **two separate deployments**:
1. **Frontend** (React + Vite) → Deploy on Vercel
2. **Signaling Server** (Node.js + Socket.io) → Deploy on Render, Railway, or similar

## Step 1: Deploy the Signaling Server

Your signaling server (`server/server.js`) needs to run 24/7 on a platform that supports WebSocket connections.

### Option A: Deploy on Render (Recommended - Free Tier Available)

1. **Create a new folder for the server:**
   ```bash
   mkdir costream-server
   cd costream-server
   npm init -y
   npm install express socket.io cors
   ```

2. **Copy your `server/server.js` to this folder as `index.js`**

3. **Create a `package.json` with start script:**
   ```json
   {
     "name": "costream-signaling-server",
     "version": "1.0.0",
     "main": "index.js",
     "scripts": {
       "start": "node index.js"
     },
     "dependencies": {
       "express": "^4.18.2",
       "socket.io": "^4.6.1",
       "cors": "^2.8.5"
     }
   }
   ```

4. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial signaling server"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/costream-server.git
   git push -u origin main
   ```

5. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Use these settings:
     - **Name:** costream-signaling-server
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free
   - Click "Create Web Service"

6. **Get your server URL:**
   - After deployment, Render will give you a URL like: `https://costream-signaling-server.onrender.com`
   - Copy this URL (you'll need it for Step 2)

### Option B: Deploy on Railway

1. Follow similar steps as Render
2. Railway URL will look like: `https://your-app.up.railway.app`

### Option C: Deploy on Heroku

1. Install Heroku CLI
2. Create app: `heroku create costream-signaling-server`
3. Push: `git push heroku main`
4. URL: `https://costream-signaling-server.herokuapp.com`

---

## Step 2: Deploy Frontend on Vercel

1. **Update your `.env.local` file with the signaling server URL:**
   ```bash
   VITE_SIGNALING_SERVER_URL=https://costream-signaling-server.onrender.com
   ```
   *(Replace with your actual signaling server URL from Step 1)*

2. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Configure production signaling server"
   git push origin main
   ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your `costream` repository
   - Configure:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - **Add Environment Variable:**
     - Key: `VITE_SIGNALING_SERVER_URL`
     - Value: `https://costream-signaling-server.onrender.com` (your server URL)
   - Click "Deploy"

4. **Your app will be live at:** `https://costream.vercel.app` (or similar)

---

## Step 3: Update CORS on Signaling Server

After deploying the frontend, update your signaling server's CORS settings to allow your Vercel domain.

In `server/server.js`, change:
```javascript
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev simplicity
    methods: ["GET", "POST"]
  }
});
```

To:
```javascript
const io = new Server(server, {
  cors: {
    origin: [
      "https://costream.vercel.app",  // Your Vercel domain
      "http://localhost:5173"          // Keep for local dev
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

Push this change and Render will auto-redeploy.

---

## Testing Your Deployment

1. Open your Vercel URL: `https://costream.vercel.app`
2. Click "Create Room"
3. You should see a Room ID
4. Open the same URL in an incognito/private window
5. Click "Join Room" and enter the Room ID
6. Both users should connect and see each other's video

---

## Troubleshooting

### "Waiting for partner to join..." forever
- **Check:** Is your signaling server running? Visit the server URL in a browser
- **Check:** Are environment variables set correctly in Vercel?
- **Check:** Open browser console (F12) and look for connection errors

### WebSocket connection failed
- **Check:** Your hosting platform supports WebSocket (Render, Railway, Heroku all do)
- **Check:** CORS is configured correctly on the signaling server

### Video not showing
- **Check:** Browser permissions for camera/microphone
- **Check:** HTTPS is required for camera access (both Vercel and Render provide HTTPS)

---

## Cost Estimates

- **Render Free Tier:** Spins down after 15 min of inactivity (reconnects automatically)
- **Railway Free Trial:** $5 credit, then ~$5-10/month
- **Vercel Free Tier:** Unlimited for personal projects

For production, consider upgrading Render to prevent cold starts ($7/month).
