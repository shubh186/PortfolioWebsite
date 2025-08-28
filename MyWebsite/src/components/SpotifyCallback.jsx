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

        setStatus('Authorization successful! Redirecting...');

        // Store the code in localStorage for the main component to use
        localStorage.setItem('spotify_auth_code', code);
        localStorage.setItem('spotify_auth_timestamp', Date.now().toString());

        // Redirect back to main page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);

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
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #8CBD8C',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
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
