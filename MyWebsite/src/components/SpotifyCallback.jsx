import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SpotifyCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus(`Error: ${error}`);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!code) {
          setStatus('No authorization code received');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        setStatus('Exchanging code for tokens...');

        // Exchange the authorization code for access and refresh tokens
        try {
          const response = await fetch('http://localhost:5000/api/spotify/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.status}`);
          }

          const tokenData = await response.json();
          
          if (tokenData.success) {
            setStatus('Authentication successful! Saving tokens...');
            
            // Store the tokens in localStorage for backup
            localStorage.setItem('spotify_access_token', tokenData.accessToken);
            localStorage.setItem('spotify_auth_timestamp', Date.now().toString());
            localStorage.setItem('spotify_auth_status', 'authenticated');
            
            // Also ensure the server has the token by sending it explicitly
            try {
              await fetch('http://localhost:5000/api/spotify/store-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  accessToken: tokenData.accessToken,
                  expiresIn: 3600 // Default 1 hour
                })
              });
              console.log('Token synced with server');
            } catch (syncError) {
              console.warn('Failed to sync token with server:', syncError);
              // Continue anyway, as the main token exchange succeeded
            }
            
            setStatus('Authentication complete! Redirecting...');
            
            // Redirect back to main page after a short delay
            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            throw new Error('Token exchange response indicated failure');
          }
        } catch (tokenError) {
          console.error('Token exchange error:', tokenError);
          setStatus('Token exchange failed. Please try again.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('Error processing callback');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#31363f',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#2a2d33',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ color: '#8CBD8C', marginBottom: '20px' }}>Spotify Authorization</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>{status}</p>
        
        {/* Show spinner only while processing */}
        {!status.includes('Error') && !status.includes('complete') && (
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #8CBD8C',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        )}
        
        {/* Show success checkmark when complete */}
        {status.includes('complete') && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#8CBD8C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '24px'
          }}>
            ✓
          </div>
        )}
        
        {/* Show error icon for errors */}
        {status.includes('Error') && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ff6b6b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '24px'
          }}>
            ✕
          </div>
        )}
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SpotifyCallback;