import React, { useEffect } from 'react';
import { getTokenFromUrl, setAccessToken } from './spotifyService';

const SpotifyCallback = () => {
  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) {
      setAccessToken(token);
      // Redirect back to main page
      window.location.href = '/';
    } else {
      // Handle error case
      console.error('No token found in URL');
      window.location.href = '/';
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#8CBD8C',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🎵</div>
        <div>Connecting to Spotify...</div>
        <div style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.8 }}>
          Please wait while we authenticate your account
        </div>
      </div>
    </div>
  );
};

export default SpotifyCallback;
