# Spotify Backend API

Express.js backend server for Spotify API integration.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend folder with:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_USER_ID=your_spotify_user_id_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Get Your Spotify Credentials

1. **Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)**
2. **Click on your app**
3. **Copy Client ID and Client Secret**
4. **Get your User ID:**
   - Go to your Spotify profile
   - Right-click → Copy Spotify URI
   - Extract the ID (e.g., `spotify:user:abc123` → `abc123`)

### 4. Start the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### GET `/api/spotify/current-track`
Returns your current playing track or last played track.

**Response:**
```json
{
  "name": "Song Name",
  "artist": "Artist Name",
  "album": "Album Name",
  "isPlaying": true,
  "albumArt": "https://...",
  "duration": 180000,
  "progress": 45000
}
```

### GET `/api/spotify/recent-tracks?limit=5`
Returns your recently played tracks.

### GET `/api/health`
Health check endpoint with configuration status.

## 🔧 How It Works

1. **Client Credentials Flow:** Gets access token using your app credentials
2. **Token Management:** Automatically refreshes expired tokens
3. **Real-time Data:** Fetches current playing and recent tracks
4. **Error Handling:** Graceful fallbacks and error responses

## 🎯 Integration

Your React frontend will call these endpoints to display:
- Current playing track
- Last played track
- Album artwork
- Playback status

## 🚨 Important Notes

- **No user login required** - shows YOUR music data
- **Automatic token refresh** - handles Spotify API authentication
- **CORS enabled** - works with your React frontend
- **Error handling** - graceful fallbacks for API failures
