# Portfolio Website

My personal portfolio site showing projects, experience, and what I'm currently listening to on Spotify. Built with React and Node.js, deployed on Vercel.

## Project Structure

```
PortfolioWebsite/
├── api/
│   └── index.js          # Vercel serverless entry point
├── Backend/
│   ├── server.js         # Express API server
│   ├── azure-setup.sql   # Database schema for Azure SQL
│   ├── package.json
├── Frontend/
│   ├── src/              # React source code
│   ├── public/           # Static assets (images, resume)
│   └── package.json
├── vercel.json           # Vercel deployment config
└── package.json          # Root scripts
```

## Features

- **Spotify Widget**: Shows what I'm currently playing or last played
- **Contact Form**: Saves submissions to Azure SQL database
- **Resume Download**: Pull-to-download ID card
- **Projects Showcase**: Honeycomb grid layout
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

**Frontend**: React, Three.js, React Router, FontAwesome  
**Backend**: Node.js, Express, Azure SQL (mssql), Spotify Web API  
**Hosting**: Vercel (both frontend and backend)

## Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/shubh186/PortfolioWebsite.git
   cd PortfolioWebsite
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Copy `Backend/env.example` to `Backend/.env` and fill in:
   - Spotify credentials (client ID, secret, redirect URI)
   - Azure SQL connection details (host, database, user, password)
   - Frontend URL for CORS

4. **Run locally**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Deployment

Pushes to `main` branch automatically deploy to Vercel. Make sure environment variables are set in Vercel dashboard:

**Required**:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI` (e.g., https://s-joshi.com/callback)
- `FRONTEND_URL` (e.g., https://s-joshi.com)
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `DB_SSL`

## Spotify Setup

1. Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add redirect URI: `https://your-domain.com/callback`
3. Copy client ID and secret to environment variables
4. Visit `/api/spotify/auth` once to authenticate as the owner
5. Tokens are stored in the database and auto-refresh

## API Endpoints

- `GET /api/health` - Server status and DB connection
- `GET /api/health/db` - Test database connection
- `GET /api/spotify/auth` - Get Spotify auth URL (owner only)
- `GET /api/spotify/auth-status` - Check if owner is authenticated
- `GET /api/spotify/current-track` - Current or last played track (public)
- `POST /api/contact` - Submit contact form

## Database Setup

Run `Backend/azure-setup.sql` on your Azure SQL database to create:
- `contact_submissions` table (contact form data)
- `spotify_tokens` table (owner's Spotify credentials)

Azure SQL firewall must allow Vercel IPs to connect.

## Scripts

- `npm run dev` - Run both frontend and backend
- `npm run frontend` - Frontend only
- `npm run backend` - Backend only
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies

---

Built by Shubh Joshi | [s-joshi.com](https://s-joshi.com)
