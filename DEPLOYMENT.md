# Vercel Deployment Guide

This portfolio website is configured as a monorepo that deploys both the frontend (React) and backend (Express.js) to Vercel.

## Quick Deploy

1. **Fork/Clone this repository**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`

3. **Set Environment Variables in Vercel:**
   
   **Required for Spotify Integration:**
   - `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
   - `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
   - `SPOTIFY_REDIRECT_URI` - `https://your-vercel-app.vercel.app/callback`
   - `FRONTEND_URL` - `https://your-vercel-app.vercel.app`
   
   **Optional for Database (Azure SQL):**
   - `DB_HOST` - Your Azure SQL server
   - `DB_NAME` - Database name
   - `DB_USER` - Database username
   - `DB_PASSWORD` - Database password
   - `DB_SSL` - `true`

4. **Deploy:**
   - Click "Deploy" in Vercel
   - Your app will be available at `https://your-vercel-app.vercel.app`

## Project Structure

```
PortfolioWebsite/
├── vercel.json           # Vercel configuration for monorepo
├── Frontend/             # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── Backend/              # Express.js API
│   ├── server.js
│   ├── package.json
│   └── vercel.json       # Backend-specific config
└── README.md
```

## API Routes

After deployment, your API will be available at:
- `https://your-vercel-app.vercel.app/api/health` - Health check
- `https://your-vercel-app.vercel.app/api/spotify/auth` - Spotify auth
- `https://your-vercel-app.vercel.app/api/spotify/current-track` - Current track
- `https://your-vercel-app.vercel.app/api/contact` - Contact form

## Spotify Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `https://your-vercel-app.vercel.app/callback`
4. Copy Client ID and Client Secret to Vercel environment variables

## Local Development

1. **Backend:**
   ```bash
   cd Backend
   npm install
   cp env.example .env  # Configure your environment variables
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd Frontend
   npm install
   npm start
   ```

## Environment Variables

### Backend (Backend/env.example)
- Spotify API credentials
- Database configuration (optional)
- Frontend URL for CORS

### Frontend (Frontend/env.example)
- Backend API URL
- Public URL for assets

## Troubleshooting

1. **CORS Issues:** Make sure `FRONTEND_URL` is set correctly in backend environment
2. **Spotify Auth:** Ensure redirect URI matches exactly in Spotify app settings
3. **Build Errors:** Check that all dependencies are in `package.json` files
4. **API Routes:** Verify `/api/*` routes are working at your Vercel domain

## Manual Deploy Commands

If you prefer CLI deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Notes

- The frontend is served as static files from `/Frontend/build`
- The backend API is serverless functions under `/api/*` routes
- Database connection is optional - contact form will use local JSON if DB not configured
- Tokens are persisted in Vercel's filesystem (temporary) - consider using a database for production

