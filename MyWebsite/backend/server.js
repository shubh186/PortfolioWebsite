const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Spotify API configuration
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'https://ab4f9675bf2a.ngrok-free.app/callback';

// Store user tokens (in production, use a database)
const userTokens = new Map();

// Generate Spotify authorization URL
app.get('/api/spotify/auth', (req, res) => {
  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-private',
    'user-read-email'
  ];
  
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scopes.join(' '))}&show_dialog=true`;
  
  res.json({ authUrl });
});

// Handle Spotify callback with authorization code
app.get('/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      console.error('Spotify authorization error:', error);
      return res.redirect('/?error=auth_failed');
    }
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect('/?error=no_code');
    }

    console.log('Received authorization code:', code);

    // Exchange code for tokens
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        }
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    
    // Store tokens
    const userId = 'default_user';
    userTokens.set(userId, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + (expires_in * 1000)
    });

    console.log('Successfully stored tokens for user:', userId);
    
    // Redirect back to main page with success
    res.redirect('/?auth=success');

  } catch (error) {
    console.error('Error processing callback:', error);
    res.redirect('/?error=token_exchange_failed');
  }
});

// Exchange authorization code for access token (keep for API usage)
app.post('/api/spotify/token', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        }
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    
    // Store tokens (in production, store in database with user ID)
    const userId = 'default_user'; // For now, using a default user
    userTokens.set(userId, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + (expires_in * 1000)
    });

    res.json({ 
      success: true, 
      message: 'Authentication successful',
      accessToken: access_token
    });

  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Failed to authenticate with Spotify' });
  }
});

// Refresh access token
async function refreshUserToken(userId) {
  try {
    const userToken = userTokens.get(userId);
    if (!userToken || !userToken.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('https://api.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: userToken.refreshToken
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        }
      }
    );

    const { access_token, expires_in } = response.data;
    
    userTokens.set(userId, {
      ...userToken,
      accessToken: access_token,
      expiresAt: Date.now() + (expires_in * 1000)
    });

    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Get valid access token for user
async function getUserAccessToken(userId = 'default_user') {
  const userToken = userTokens.get(userId);
  
  if (!userToken) {
    throw new Error('User not authenticated');
  }

  if (Date.now() >= userToken.expiresAt) {
    return await refreshUserToken(userId);
  }

  return userToken.accessToken;
}

// Get your current playing track
app.get('/api/spotify/current-track', async (req, res) => {
  try {
    const token = await getUserAccessToken();
    
    // Get your current playing track
    const currentResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentResponse.data && currentResponse.data.is_playing) {
      const track = currentResponse.data.item;
      return res.json({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        isPlaying: true,
        albumArt: track.album.images[0]?.url,
        duration: track.duration_ms,
        progress: currentResponse.data.progress_ms
      });
    }

    // If nothing is currently playing, get your recently played tracks
    const recentResponse = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (recentResponse.data.items && recentResponse.data.items.length > 0) {
      const track = recentResponse.data.items[0].track;
      return res.json({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        isPlaying: false,
        albumArt: track.album.images[0]?.url,
        playedAt: recentResponse.data.items[0].played_at
      });
    }

    // Fallback if no data available
    res.json({
      name: 'No recent tracks',
      artist: 'Check back later',
      isPlaying: false
    });

  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    
    if (error.message === 'User not authenticated') {
      return res.status(401).json({ error: 'Please authenticate with Spotify first' });
    }
    
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const newToken = await refreshUserToken('default_user');
        // Retry the request with new token
        return res.redirect('/api/spotify/current-track');
      } catch (refreshError) {
        return res.status(401).json({ error: 'Authentication failed, please login again' });
      }
    }
    
    res.status(500).json({
      error: 'Unable to fetch music data',
      details: error.message
    });
  }
});

// Get your recently played tracks
app.get('/api/spotify/recent-tracks', async (req, res) => {
  try {
    const token = await getUserAccessToken();
    const limit = req.query.limit || 5;
    
    const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const tracks = response.data.items.map(item => ({
      name: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      albumArt: item.track.album.images[0]?.url,
      playedAt: item.played_at
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Error fetching recent tracks:', error);
    
    if (error.message === 'User not authenticated') {
      return res.status(401).json({ error: 'Please authenticate with Spotify first' });
    }
    
    res.status(500).json({ error: 'Unable to fetch recent tracks' });
  }
});

// Check authentication status
app.get('/api/spotify/auth-status', (req, res) => {
  const userId = 'default_user';
  const userToken = userTokens.get(userId);
  
  if (userToken && Date.now() < userToken.expiresAt) {
    res.json({ authenticated: true, expiresAt: userToken.expiresAt });
  } else {
    res.json({ authenticated: false });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    spotify: {
      clientId: SPOTIFY_CLIENT_ID ? 'Configured' : 'Missing',
      clientSecret: SPOTIFY_CLIENT_SECRET ? 'Configured' : 'Missing',
      redirectUri: SPOTIFY_REDIRECT_URI,
      authenticatedUsers: userTokens.size
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Spotify Backend Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎵 Spotify auth: http://localhost:${PORT}/api/spotify/auth`);
  console.log(`🎵 Spotify current track: http://localhost:${PORT}/api/spotify/current-track`);
});
