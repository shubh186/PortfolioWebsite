import SpotifyWebApi from 'spotify-web-api-js';

// Spotify Web API instance
const spotifyApi = new SpotifyWebApi();

// Spotify App Credentials (you'll need to get these from Spotify Developer Dashboard)
const CLIENT_ID = 'f2b7c80b32f94858b5481e36d25d9344'; // Replace with your actual client ID
const REDIRECT_URI = window.location.origin + '/callback'; // Adjust if needed
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played'
];

// Spotify authentication URL
export const getAuthUrl = () => {
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=token&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(SCOPES.join(' '))}&` +
    `show_dialog=true`;
  
  return authUrl;
};

// Extract access token from URL hash
export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
};

// Set access token
export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
  localStorage.setItem('spotify_access_token', token);
};

// Get stored access token
export const getStoredToken = () => {
  return localStorage.getItem('spotify_access_token');
};

// Clear stored token
export const clearToken = () => {
  localStorage.removeItem('spotify_access_token');
  spotifyApi.setAccessToken(null);
};

// Check if token is valid
export const isTokenValid = async () => {
  try {
    await spotifyApi.getMe();
    return true;
  } catch (error) {
    return false;
  }
};

// Get currently playing track
export const getCurrentlyPlaying = async () => {
  try {
    const response = await spotifyApi.getMyCurrentPlayingTrack();
    return response;
  } catch (error) {
    console.error('Error fetching currently playing track:', error);
    throw error;
  }
};

// Get recently played tracks
export const getRecentlyPlayed = async () => {
  try {
    const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
    return response;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await spotifyApi.getMe();
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export default spotifyApi;
