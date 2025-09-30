const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://s-joshi.com',
  'https://www.s-joshi.com',
  process.env.FRONTEND_URL || null,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  /\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Spotify API configuration
const PUBLIC_BASE_URL = process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || `${PUBLIC_BASE_URL}/callback`;

// Database configuration
const dbConfig = process.env.DB_CONNECTION_STRING
  ? {
      connectionString: process.env.DB_CONNECTION_STRING,
      options: { encrypt: true, trustServerCertificate: true }
    }
  : {
      server: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT) || 1433,
      options: {
        encrypt: process.env.DB_SSL === 'true',
        trustServerCertificate: true
      }
    };

// Database connection pool
let pool;
let lastDbError = null;
async function connectDB() {
  try {
    // Check if database configuration is complete
    const hasConnStr = !!process.env.DB_CONNECTION_STRING;
    const hasDiscrete = !!(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD);
    
    console.log('🔍 Database config check:');
    console.log('   DB_CONNECTION_STRING:', hasConnStr ? 'Set' : 'Not set');
    console.log('   DB_HOST:', process.env.DB_HOST ? 'Set' : 'Not set');
    console.log('   DB_NAME:', process.env.DB_NAME ? 'Set' : 'Not set');
    console.log('   DB_USER:', process.env.DB_USER ? 'Set' : 'Not set');
    console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? 'Set' : 'Not set');
    
    if (!hasConnStr && !hasDiscrete) {
      console.log('⚠️  Database configuration incomplete. Skipping database connection.');
      console.log('   To enable database features, set the following environment variables:');
      console.log('   - DB_CONNECTION_STRING (preferred) or');
      console.log('     DB_HOST, DB_NAME, DB_USER, DB_PASSWORD');
      return;
    }
    
    console.log('🔄 Attempting database connection...');
    pool = await sql.connect(dbConfig);
    lastDbError = null;
    console.log('✅ Connected to Azure SQL Database');
  } catch (err) {
    lastDbError = err?.message || String(err);
    console.error('❌ Database connection failed:', err);
    console.error('❌ Config being used:', JSON.stringify(dbConfig, null, 2));
  }
}

// Token storage in memory (loaded from database)
let userTokens = new Map();

// Load tokens from database on startup
async function loadTokensFromDatabase() {
  try {
    if (!pool) {
      console.log('📂 No database connection, starting with empty tokens');
      return;
    }

    console.log('🔄 Loading tokens from database...');
    const request = pool.request();
    const result = await request.query('SELECT user_id, access_token, refresh_token, expires_at FROM spotify_tokens');
    
    console.log('📊 Query returned', result.recordset?.length || 0, 'rows');
    
    userTokens.clear();
    result.recordset.forEach(row => {
      console.log('✅ Loading token for user:', row.user_id);
      userTokens.set(row.user_id, {
        accessToken: row.access_token,
        refreshToken: row.refresh_token,
        expiresAt: new Date(row.expires_at).getTime()
      });
    });
    
    console.log('📂 Loaded tokens from database:', userTokens.size, 'users');
    console.log('💾 Users in memory:', Array.from(userTokens.keys()));
  } catch (error) {
    console.error('❌ Error loading tokens from database:', error.message);
    console.error('❌ Stack:', error.stack);
    userTokens = new Map();
  }
}

// Save tokens to database
async function saveTokensToDatabase(userId, accessToken, refreshToken, expiresIn) {
  try {
    if (!pool) {
      console.log('ℹ️ No database connection, attempting to connect...');
      await connectDB();
    }
    if (!pool) {
      console.log('⚠️ Database still not connected; tokens not persisted');
      return;
    }

    const expiresAt = new Date(Date.now() + (expiresIn * 1000));
    
    const request = pool.request();
    request.input('userId', sql.NVarChar, userId);
    request.input('accessToken', sql.NVarChar, accessToken);
    request.input('refreshToken', sql.NVarChar, refreshToken);
    request.input('expiresAt', sql.DateTime2, expiresAt);
    
    // Use MERGE to insert or update
    await request.query(`
      MERGE spotify_tokens AS target
      USING (
        SELECT 
          @userId       AS user_id, 
          @accessToken  AS access_token, 
          @refreshToken AS refresh_token, 
          @expiresAt    AS expires_at
      ) AS source
      ON target.user_id = source.user_id
      WHEN MATCHED THEN
        UPDATE SET 
          access_token = source.access_token,
          refresh_token = COALESCE(source.refresh_token, target.refresh_token),
          expires_at = source.expires_at,
          updated_at = GETDATE()
      WHEN NOT MATCHED THEN
        INSERT (user_id, access_token, refresh_token, expires_at)
        VALUES (source.user_id, source.access_token, source.refresh_token, source.expires_at);
    `);
    
    console.log('💾 Tokens saved to database for user:', userId);
  } catch (error) {
    console.error('❌ Error saving tokens to database:', error.message);
  }
}

// Generate Spotify authorization URL (for owner setup only)
app.get('/api/spotify/auth', (req, res) => {
  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-private',
    'user-read-email'
  ];
  
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scopes.join(' '))}&show_dialog=false`;
  
  res.json({ 
    authUrl,
    message: 'This endpoint is for owner authentication only. After setup, visitors will see your music data automatically.'
  });
});

// Admin-only endpoint to check if owner setup is needed
app.get('/api/admin/setup-needed', (req, res) => {
  const userId = 'default_user';
  const userToken = userTokens.get(userId);
  
  res.json({
    setupNeeded: !userToken,
    hasValidToken: userToken && Date.now() < userToken.expiresAt,
    message: userToken 
      ? 'Owner is authenticated and visitors can see music data'
      : 'Owner needs to authenticate first. Visit /api/spotify/auth to get started.'
  });
});

// Handle Spotify callback with authorization code (supports both /callback and /api/spotify/callback-direct)
const handleSpotifyCallback = async (req, res) => {
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

    // Save tokens to database
    await saveTokensToDatabase(userId, access_token, refresh_token, expires_in);

    console.log('Successfully stored tokens for user:', userId);
    console.log('🎉 Owner authentication complete! Visitors can now see your music data.');
    
    // Redirect back to main page with success
    res.redirect('/?auth=success&setup=complete');

  } catch (error) {
    console.error('Error processing callback:', error);
    res.redirect('/?error=token_exchange_failed');
  }
};

// Mount callback handler on both routes
app.get('/callback', handleSpotifyCallback);
app.get('/api/spotify/callback-direct', handleSpotifyCallback);

// Exchange authorization code for access token (Alternative API endpoint)
app.post('/api/spotify/token', async (req, res) => {
  try {
    console.log('🔐 Token exchange request received');
    console.log('Request body:', req.body);
    
    const { code } = req.body;
    
    if (!code) {
      console.log('❌ No authorization code in request body');
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
    console.log('✅ Spotify tokens received successfully');
    console.log('Access token:', access_token.substring(0, 20) + '...');
    console.log('Expires in:', expires_in, 'seconds');
    
    // Store tokens
    const userId = 'default_user';
    userTokens.set(userId, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + (expires_in * 1000)
    });

    // Save tokens to database
    await saveTokensToDatabase(userId, access_token, refresh_token, expires_in);

    console.log('💾 Tokens stored in memory and file for user:', userId);
    console.log('Current userTokens size:', userTokens.size);
    console.log('Stored token expires at:', new Date(Date.now() + (expires_in * 1000)).toISOString());

    res.json({ 
      success: true, 
      message: 'Authentication successful',
      accessToken: access_token
    });

  } catch (error) {
    console.error('❌ Error exchanging code for token:', error);
    if (error.response) {
      console.error('Spotify API response:', error.response.data);
      console.error('Status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to authenticate with Spotify' });
  }
});

// Accept tokens from frontend (for when tokens are stored in localStorage)
app.post('/api/spotify/store-token', async (req, res) => {
  try {
    const { accessToken, refreshToken, expiresIn } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }
    
    const userId = 'default_user';
    userTokens.set(userId, {
      accessToken: accessToken,
      refreshToken: refreshToken || null,
      expiresAt: Date.now() + ((expiresIn || 3600) * 1000)
    });
    
    // Only persist to DB when we have a refresh token (avoids NOT NULL constraint failures)
    if (refreshToken) {
      await saveTokensToDatabase(userId, accessToken, refreshToken, expiresIn || 3600);
    }
    
    console.log('📥 Token stored from frontend for user:', userId);
    res.json({ success: true, message: 'Token stored successfully' });
    
  } catch (error) {
    console.error('Error storing token from frontend:', error);
    res.status(500).json({ error: 'Failed to store token' });
  }
});

// Refresh access token
async function refreshUserToken(userId) {
  try {
    const userToken = userTokens.get(userId);
    if (!userToken || !userToken.refreshToken) {
      throw new Error('No refresh token available');
    }

    console.log('🔄 Refreshing token for user:', userId);
    
    const response = await axios.post('https://accounts.spotify.com/api/token',
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

    const { access_token, expires_in, refresh_token } = response.data;
    
    userTokens.set(userId, {
      ...userToken,
      accessToken: access_token,
      refreshToken: refresh_token || userToken.refreshToken, // Keep old refresh token if new one not provided
      expiresAt: Date.now() + (expires_in * 1000)
    });

    await saveTokensToDatabase(userId, access_token, refresh_token, expires_in);
    console.log('✅ Token refreshed successfully');
    
    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Get valid access token for user
async function getUserAccessToken(userId = 'default_user') {
  let userToken = userTokens.get(userId);
  
  // If token not in memory, try loading from database
  if (!userToken && pool) {
    console.log('⚠️ Token not in memory, attempting to load from database...');
    await loadTokensFromDatabase();
    userToken = userTokens.get(userId);
  }
  
  if (!userToken) {
    console.log('❌ No token found for user:', userId);
    console.log('Available users:', Array.from(userTokens.keys()));
    throw new Error('User not authenticated');
  }

  // Check if token is expired (with 5 minute buffer)
  if (Date.now() >= (userToken.expiresAt - 300000)) {
    console.log('🔄 Token expired, attempting refresh...');
    return await refreshUserToken(userId);
  }

  console.log('✅ Using valid token for user:', userId);
  return userToken.accessToken;
}

// Get owner's current playing track (public endpoint)
app.get('/api/spotify/current-track', async (req, res) => {
  try {
    // Always use the stored owner token, ignore any visitor auth headers
    const token = await getUserAccessToken();
    
    // Get owner's current playing track
    const currentResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentResponse.data && currentResponse.data.is_playing) {
      const track = currentResponse.data.item;
      console.log('▶️ Currently playing:', track.name, 'by', track.artists[0].name);
      return res.json({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        isPlaying: true,
        albumArt: track.album.images[0]?.url,
        duration: track.duration_ms,
        progress: currentResponse.data.progress_ms
      });
    } else if (currentResponse.data && currentResponse.data.item) {
      // Track is loaded but paused
      const track = currentResponse.data.item;
      console.log('⏸️ Track paused:', track.name, 'by', track.artists[0].name);
      return res.json({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        isPlaying: false,
        albumArt: track.album.images[0]?.url,
        duration: track.duration_ms,
        progress: currentResponse.data.progress_ms,
        status: 'paused'
      });
    }

    // If nothing is currently playing, get your recently played tracks
    console.log('🔍 Nothing currently playing, fetching recently played tracks...');
    
    const recentResponse = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('📻 Recent tracks response:', {
      total: recentResponse.data.items?.length || 0,
      items: recentResponse.data.items?.map(item => ({
        name: item.track.name,
        playedAt: item.played_at
      })) || []
    });

    if (recentResponse.data.items && recentResponse.data.items.length > 0) {
      const track = recentResponse.data.items[0].track;
      console.log('✅ Found recent track:', track.name);
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
    console.log('⚠️ No recent tracks found, trying alternative approach...');
    
    // Try to get the last played track from a different endpoint
    try {
      const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=short_term', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (topTracksResponse.data.items && topTracksResponse.data.items.length > 0) {
        const track = topTracksResponse.data.items[0];
        console.log('🎯 Found top track as fallback:', track.name);
        return res.json({
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          isPlaying: false,
          albumArt: track.album.images[0]?.url,
          fallback: 'Using top track as recent track'
        });
      }
    } catch (fallbackError) {
      console.log('⚠️ Fallback approach also failed:', fallbackError.message);
    }
    
    // Final fallback
    res.json({
      name: 'No recent tracks',
      artist: 'Check back later',
      isPlaying: false,
      message: 'Try playing a song to see your music here'
    });

  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    
    if (error.message === 'User not authenticated') {
      return res.status(401).json({ 
        error: 'Please authenticate with Spotify first',
        authUrl: `/api/spotify/auth`,
        message: 'Visit the auth endpoint to get started'
      });
    }
    
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const newToken = await refreshUserToken('default_user');
        // Retry the request with new token
        return res.redirect('/api/spotify/current-track');
      } catch (refreshError) {
        return res.status(401).json({ 
          error: 'Authentication failed, please login again',
          authUrl: `/api/spotify/auth`
        });
      }
    }
    
    res.status(500).json({
      error: 'Unable to fetch music data',
      details: error.message
    });
  }
});

// Get owner's recently played tracks (public endpoint)
app.get('/api/spotify/recent-tracks', async (req, res) => {
  try {
    // Always use the stored owner token, ignore any visitor auth headers
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
      return res.status(401).json({ 
        error: 'Please authenticate with Spotify first',
        authUrl: `/api/spotify/auth`,
        message: 'Visit the auth endpoint to get started'
      });
    }
    
    res.status(500).json({ error: 'Unable to fetch recent tracks' });
  }
});

// Manually reload tokens from database (for debugging)
app.get('/api/spotify/reload-tokens', async (req, res) => {
  try {
    console.log('🔄 Manual token reload requested');
    await loadTokensFromDatabase();
    res.json({ 
      success: true, 
      tokensLoaded: userTokens.size,
      users: Array.from(userTokens.keys()),
      message: `Loaded ${userTokens.size} user token(s) from database`
    });
  } catch (error) {
    console.error('❌ Manual reload failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Check owner authentication status (for admin use)
app.get('/api/spotify/auth-status', (req, res) => {
  const userId = 'default_user';
  const userToken = userTokens.get(userId);
  
  if (userToken) {
    const isExpired = Date.now() >= userToken.expiresAt;
    res.json({
      authenticated: true,
      expired: isExpired,
      expiresAt: new Date(userToken.expiresAt).toISOString(),
      hasRefreshToken: !!userToken.refreshToken,
      message: isExpired ? 'Owner token expired, will refresh on next request' : 'Owner token valid',
      isOwnerToken: true
    });
  } else {
    res.json({
      authenticated: false,
      message: 'Owner not authenticated. Please authenticate first.',
      authUrl: '/api/spotify/auth',
      isOwnerToken: false
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: {
      connected: !!pool,
      mode: process.env.DB_CONNECTION_STRING ? 'connectionString' : 'discrete',
      host: process.env.DB_HOST || undefined,
      name: process.env.DB_NAME || undefined,
      lastError: lastDbError || undefined
    },
    spotify: {
      clientId: SPOTIFY_CLIENT_ID ? 'Configured' : 'Missing',
      clientSecret: SPOTIFY_CLIENT_SECRET ? 'Configured' : 'Missing',
      redirectUri: SPOTIFY_REDIRECT_URI,
      authenticatedUsers: userTokens.size
    }
  });
});

// On-demand DB check
app.get('/api/health/db', async (req, res) => {
  try {
    if (!pool) {
      await connectDB();
    }
    if (!pool) {
      return res.status(503).json({ ok: false, connected: false, reason: 'dbPool not initialized', lastError: lastDbError });
    }
    const result = await pool.request().query('SELECT 1 as ok');
    res.json({ ok: true, connected: true, result: result.recordset });
  } catch (err) {
    lastDbError = err?.message || String(err);
    res.status(500).json({ ok: false, connected: false, error: lastDbError });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, reason } = req.body;
    
    // Validate required fields
    if (!name || !email || !reason) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Please fill in all fields'
      });
    }
    
    // Log the contact form submission
    console.log('📧 Contact form submission:', { name, email, reason });
    
    // Save to database (retry connect if needed)
    if (!pool) {
      await connectDB();
    }
    if (pool) {
      const query = `
        INSERT INTO contact_submissions (name, email, reason, created_at)
        VALUES (@name, @email, @reason, @created_at)
      `;
      
      const request = pool.request()
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .input('reason', sql.NVarChar, reason)
        .input('created_at', sql.DateTime2, new Date());
      
      await request.query(query);
      console.log('💾 Contact submission saved to database');
      
      res.json({ 
        success: true, 
        persisted: true,
        storage: 'database',
        message: 'Thank you for your message! I\'ll get back to you soon.',
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('⚠️ Database not connected, storing in temporary file instead');
      // Fallback for serverless: write to /tmp (ephemeral) so request succeeds
      const contactData = { name, email, reason, timestamp: new Date().toISOString() };
      const tmpDir = process.env.TMP_DIR || '/tmp';
      const contactFile = path.join(tmpDir, 'contact_submissions.json');

      try {
        let submissions = [];
        if (fs.existsSync(contactFile)) {
          submissions = JSON.parse(fs.readFileSync(contactFile, 'utf8'));
        }
        submissions.push(contactData);
        fs.writeFileSync(contactFile, JSON.stringify(submissions, null, 2));
        console.log('📄 Contact submission saved to', contactFile);
      } catch (fileErr) {
        console.warn('⚠️ Could not write to tmp file:', fileErr.message);
        // Continue without failing the request
      }

      res.json({ 
        success: true, 
        persisted: false,
        storage: 'tmp',
        message: 'Thank you for your message! I\'ll get back to you soon.',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ 
      success: false,
      persisted: false,
      storage: 'none',
      error: 'Failed to send message',
      details: error?.message,
      message: 'Please try again later'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Root handler
app.get('/', (req, res) => {
  res.send('🚀 Backend is running! Try /api/health or /api/spotify/auth');
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

// Initialize database and load tokens
async function initializeApp() {
  await connectDB();
  
  // Give DB a moment to be fully ready, then load tokens
  if (pool) {
    console.log('⏳ Waiting 1 second for DB pool to stabilize...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadTokensFromDatabase();
  } else {
    console.warn('⚠️ No database pool available, skipping token load');
  }
}

initializeApp(); // start DB connection and load tokens on cold start

module.exports = app; // let Vercel handle serving
