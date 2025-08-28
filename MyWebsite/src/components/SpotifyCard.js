import React, { useState, useEffect } from 'react';
import { 
  getAuthUrl, 
  getTokenFromUrl, 
  setAccessToken, 
  getStoredToken, 
  clearToken,
  isTokenValid,
  getCurrentlyPlaying,
  getRecentlyPlayed,
  getUserProfile
} from './spotifyService';

const SpotifyCard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Spotify connection
  useEffect(() => {
    initializeSpotify();
  }, []);

  // Check for currently playing track periodically
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentTrack();
      const interval = setInterval(fetchCurrentTrack, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const initializeSpotify = async () => {
    try {
      // Check if we have a token in the URL (from callback)
      const urlToken = getTokenFromUrl();
      if (urlToken) {
        setAccessToken(urlToken);
        setIsAuthenticated(true);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Check for stored token
        const storedToken = getStoredToken();
        if (storedToken) {
          setAccessToken(storedToken);
          const isValid = await isTokenValid();
          if (isValid) {
            setIsAuthenticated(true);
          } else {
            clearToken();
          }
        }
      }
    } catch (error) {
      console.error('Error initializing Spotify:', error);
      setError('Failed to connect to Spotify');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentTrack = async () => {
    try {
      const response = await getCurrentlyPlaying();
      
      if (response && response.item) {
        setCurrentTrack(response);
        setError(null);
      } else {
        // If nothing is currently playing, get recently played
        const recentResponse = await getRecentlyPlayed();
        if (recentResponse && recentResponse.items && recentResponse.items.length > 0) {
          const recentTrack = recentResponse.items[0].track;
          setCurrentTrack({
            item: recentTrack,
            is_playing: false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching track:', error);
      if (error.status === 401) {
        // Token expired
        clearToken();
        setIsAuthenticated(false);
        setError('Please reconnect to Spotify');
      } else {
        setError('Failed to fetch track data');
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleConnect = () => {
    window.location.href = getAuthUrl();
  };

  const handleDisconnect = () => {
    clearToken();
    setIsAuthenticated(false);
    setCurrentTrack(null);
    setUserProfile(null);
    setError(null);
  };

  // Fetch user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && !userProfile) {
      fetchUserProfile();
    }
  }, [isAuthenticated, userProfile]);

  if (isLoading) {
    return (
      <div className="spotify-card">
        <div className="album-art">
          <div className="album-placeholder">
            <span className="music-note">🎵</span>
          </div>
        </div>
        <div className="track-info">
          <div className="last-played">Loading...</div>
          <div className="track-title">Connecting to Spotify</div>
          <div className="artist-name">Please wait</div>
        </div>
        <div className="spotify-logo">
          <div className="spotify-icon">
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="spotify-card">
        <div className="album-art">
          <div className="album-placeholder">
            <span className="music-note">🎵</span>
          </div>
        </div>
        <div className="track-info">
          <div className="last-played">Connect to Spotify</div>
          <div className="track-title">Show your music</div>
          <div className="artist-name">Click to connect</div>
        </div>
        <div className="spotify-logo" onClick={handleConnect} style={{ cursor: 'pointer' }}>
          <div className="spotify-icon">
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spotify-card">
        <div className="album-art">
          <div className="album-placeholder">
            <span className="music-note">⚠️</span>
          </div>
        </div>
        <div className="track-info">
          <div className="last-played">Error</div>
          <div className="track-title">{error}</div>
          <div className="artist-name">Click to reconnect</div>
        </div>
        <div className="spotify-logo" onClick={handleConnect} style={{ cursor: 'pointer' }}>
          <div className="spotify-icon">
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="spotify-card">
        <div className="album-art">
          <div className="album-placeholder">
            <span className="music-note">🎵</span>
          </div>
        </div>
        <div className="track-info">
          <div className="last-played">No music playing</div>
          <div className="track-title">Start playing something</div>
          <div className="artist-name">{userProfile?.display_name || 'Spotify User'}</div>
        </div>
        <div className="spotify-logo">
          <div className="spotify-icon">
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
            <div className="spotify-line"></div>
          </div>
        </div>
      </div>
    );
  }

  const track = currentTrack.item;
  const albumArt = track.album.images[0]?.url;
  const isPlaying = currentTrack.is_playing;

  return (
    <div className="spotify-card">
      <div className="album-art">
        {albumArt ? (
          <img 
            src={albumArt} 
            alt={`${track.name} album art`}
            className="album-image"
          />
        ) : (
          <div className="album-placeholder">
            <span className="music-note">🎵</span>
          </div>
        )}
        {isPlaying && <div className="playing-indicator">▶️</div>}
      </div>
      <div className="track-info">
        <div className="last-played">
          {isPlaying ? 'Now playing' : 'Last played'}
        </div>
        <div className="track-title" title={track.name}>
          {track.name}
        </div>
        <div className="artist-name" title={track.artists.map(a => a.name).join(', ')}>
          {track.artists.map(a => a.name).join(', ')}
        </div>
      </div>
      <div className="spotify-logo" onClick={handleDisconnect} style={{ cursor: 'pointer' }}>
        <div className="spotify-icon">
          <div className="spotify-line"></div>
          <div className="spotify-line"></div>
          <div className="spotify-line"></div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyCard;
