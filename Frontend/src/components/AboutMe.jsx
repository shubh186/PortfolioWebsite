import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../App.css';

// Sub-component 1: Availability Status
const AvailabilityStatus = () => {
  return (
    <div className="availability-status">
      <div className="status-indicator">
        <div className="status-dot"></div>
        Available for projects
      </div>
    </div>
  );
};

// Sub-component 2: Heading Text
const HeadingText = () => {
  return (
    <div className="intro">
      Hi, I'm Shubh.
      <br />
      A software developer | designer | creator.
    </div>
  );
};

// Sub-component 3: Sub Text
const SubText = () => {
  return (
    <div className="about-me">
      Though I could fit neatly into the modern labels of computer scientist or developer, that’s not really me. I specialize in creating experiences and solutions that bridge the gap between traditional software roles and the bigger picture.
      <br /><br />
      I’m a plug-and-play builder — stepping into whatever role a project needs, from development to product — helping innovative ideas come to life and shaping them into meaningful experiences. Pull the ID card to download my resume!
    </div>
  );
};

// Sub-component 4: Spotify Card - Shows Owner's Music Data
const SpotifyCard = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch owner's music data on mount
  useEffect(() => {
    fetchSpotifyData();
    // Refresh every 30 seconds to keep it current
    const interval = setInterval(fetchSpotifyData, 30000);
    return () => clearInterval(interval);
  }, []);


  const handleSpotifyAuth = async () => {
    try {
      console.log('🎵 Spotify card clicked! Starting authentication...');
      
      // Call backend to get auth URL
      const base = process.env.NODE_ENV === 'development'
        ? ''
        : (process.env.REACT_APP_BACKEND_URL || '');
      const response = await fetch(`${base}/api/spotify/auth`);
      console.log('📡 Auth response status:', response.status);
      
      const data = await response.json();
      console.log('📋 Auth response data:', data);
      
      if (data.authUrl) {
        console.log('🔗 Redirecting to Spotify auth URL:', data.authUrl);
        // Open in same window - the redirect will bring them back
        window.location.href = data.authUrl;
      } else {
        console.log('❌ No auth URL in response');
      }
    } catch (err) {
      console.error('❌ Error getting auth URL:', err);
      setError('Unable to connect to Spotify');
    }
  };

  const fetchSpotifyData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Call backend to get owner's music data
      const base = process.env.NODE_ENV === 'development'
        ? ''
        : (process.env.REACT_APP_BACKEND_URL || '');
      const response = await fetch(`${base}/api/spotify/current-track`);
      
      if (response.ok) {
        const data = await response.json();
        setCurrentTrack(data);
      } else if (response.status === 401) {
        // Owner needs to authenticate - show helpful message
        setError('Click to authenticate Spotify');
        setCurrentTrack({
          name: 'Music setup required',
          artist: 'Click to authenticate',
          isPlaying: false
        });
      } else {
        setCurrentTrack({
          name: 'Music not available',
          artist: 'Check back later',
          isPlaying: false
        });
      }
    } catch (err) {
      console.error('Error fetching Spotify data:', err);
      setError('Click to connect Spotify');
      setCurrentTrack({
        name: 'Music not available',
        artist: 'Click to connect',
        isPlaying: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="spotify-card">
        <div className="album-art">
          <div className="album-placeholder">
            <div className="music-note">🎵</div>
          </div>
        </div>
        <div className="track-info">
          <div className="last-played">Loading...</div>
          <div className="track-title">Fetching music data</div>
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

  return (
    <div 
      className="spotify-card" 
      onClick={error ? handleSpotifyAuth : undefined}
      style={{ cursor: error ? 'pointer' : 'default' }}
      title={error ? 'Click to authenticate Spotify' : ''}
    >
      <div className="album-art">
        {currentTrack?.albumArt ? (
          <img 
            src={currentTrack.albumArt} 
            alt="Album Art" 
            style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
          />
        ) : (
          <div className="album-placeholder">
            <div className="music-note">🎵</div>
          </div>
        )}
        <div className={`playing-indicator ${currentTrack?.isPlaying ? 'playing' : ''}`}>
          {currentTrack?.isPlaying ? '▶' : '⏸'}
        </div>
      </div>
      <div className="track-info">
        <div className="last-played">
          {currentTrack?.isPlaying ? 'Now Playing' : 'Last Played'}
        </div>
        <div className="track-title">
          {isLoading ? 'Loading...' : (currentTrack?.name || 'No track data')}
        </div>
        <div className="artist-name">
          {isLoading ? 'Spotify' : (currentTrack?.artist || 'Unknown artist')}
        </div>
      </div>
      <div className="spotify-logo">
        <div className="spotify-icon">
          <div className="spotify-line"></div>
          <div className="spotify-line"></div>
          <div className="spotify-line"></div>
        </div>
      </div>
      {error && (
        <div className="spotify-error-overlay">
          <div className="error-text">{error}</div>
        </div>
      )}
    </div>
  );
};

// Sub-component 5: Countries Visited Card
const CountriesVisitedCard = () => {
  // Always-visible list; no hover state needed
  const countries = [
    { code: 'ca', name: 'Canada' },
    { code: 'us', name: 'USA' },
    { code: 'gb', name: 'UK' },
    { code: 'ae', name: 'UAE' },
    { code: 'in', name: 'India' },
    { code: 'vn', name: 'Vietnam' },
    { code: 'mu', name: 'Mauritius' }
  ];

  return (
    <div className="countries-card">
      <div className="countries-content">
        <div className="countries-text">
          <div className="countries-title">Places I've been</div>
        </div>
        <div className="countries-icon">
          <div className="location-icon">📍</div>
        </div>
      </div>
      <div className="countries-list">
        {countries.map((country, index) => (
          <div key={index} className="country-item">
            <span className="country-flag">
              <img 
                src={`https://flagcdn.com/24x18/${country.code}.png`} 
                alt={`${country.name} flag`} 
                width="24" 
                height="18" 
                loading="lazy"
              />
            </span>
            <span className="country-name">{country.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-component 6: ID Card
const IdCard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isSwinging, setIsSwinging] = useState(true); // Start with swinging enabled
  const [stringLength, setStringLength] = useState(60);
  const [hasDownloaded, setHasDownloaded] = useState(false); // Prevent multiple downloads
  const [maxDragDistance, setMaxDragDistance] = useState(0); // Track maximum drag distance
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const stringRef = useRef(null);

  const downloadResume = useCallback(() => {
    console.log('Attempting to download Development.pdf...');
    
    // Check if the file exists first
    fetch('/Development.pdf')
      .then(response => {
        if (response.ok) {
          console.log('Development file found, downloading...');
          const link = document.createElement('a');
          link.href = '/Development.pdf';
          link.download = 'Development.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('Download initiated');
        } else {
          console.error('Development file not found (404)');
          alert('Development file not found. Please ensure Development.pdf is in the public folder.');
        }
      })
      .catch(error => {
        console.error('Error checking development file:', error);
        alert('Error downloading development file. Please check the console for details.');
      });
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setIsSwinging(false);
    setMaxDragDistance(0); // Reset max distance for new drag session
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const deltaX = (mouseX - centerX) * 0.3; // Increased from 0.1 to 0.3
    const deltaY = (mouseY - centerY) * 0.3; // Increased from 0.1 to 0.3
    
    // Calculate string length based on drag distance with much more range
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const newStringLength = Math.max(60, 60 + distance * 1.5); // Increased multiplier from 0.5 to 1.5
    setStringLength(newStringLength);
    
    setDragPosition({ x: deltaX, y: deltaY });
    
    // Track maximum drag distance reached during this drag session
    if (distance > maxDragDistance) {
      setMaxDragDistance(distance);
    }
  }, [isDragging, maxDragDistance]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      // Check if maximum drag distance exceeded threshold and trigger download
      if (maxDragDistance > 100 && !hasDownloaded) {
        console.log('PDF download triggered on release! Max distance:', maxDragDistance);
        setHasDownloaded(true); // Prevent multiple downloads
        downloadResume();
      }
      
      // Reset download flag and max distance for next drag session
      setHasDownloaded(false);
      setMaxDragDistance(0);
      
      // Immediately reset to exact original position
      setDragPosition({ x: 0, y: 0 });
      setStringLength(60);
      
      // Start swinging animation after a brief delay
      setTimeout(() => {
        setIsSwinging(true);
        // Ensure card is exactly at original position
        setDragPosition({ x: 0, y: 0 });
      }, 100);
    }
  }, [isDragging, maxDragDistance, hasDownloaded, downloadResume]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      className={`id-card-container ${isDragging ? 'dragging' : ''}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 3D String attachment - Fixed position */}
      <div 
        className="id-card-string" 
        ref={stringRef}
        style={{ 
          height: `${stringLength}px`
        }}
      >
        <div className="string-line"></div>
        <div className="string-knot"></div>
      </div>
      
      <div 
        className={`id-card ${isSwinging ? 'swinging' : ''}`}
        ref={cardRef}
        style={{
          transform: isDragging 
            ? `translate(${dragPosition.x}px, ${dragPosition.y}px) rotate(${dragPosition.x * 0.1}deg)`
            : undefined
        }}
      >
        <div className="id-card-header">
          <div className="profile-picture">
            <img src={process.env.PUBLIC_URL + '/images/me.jpg'} alt="Shubh Joshi" />
          </div>
          <div className="id-info">
            <div className="name">Shubh Joshi</div>
            <div className="title">Software Developer | Product</div>
          </div>
        </div>
        <div className="id-card-body">
          <div className="id-details">
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">shubh.joshi@gmail.com</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">Toronto, ON</span>
            </div>
            <div className="detail-row">
              <span className="label">Experience:</span>
              <span className="value">3+ Years</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bouncing arrows to indicate pull direction */}
      <div className="pull-indicator">
        <div className="arrow-container">
          <div className="arrow"></div>
          <div className="arrow"></div>
        </div>
      </div>
    </div>
  );
};

// Main AboutMe Component
const AboutMe = () => {
  return (
    <div className="home-container">
      <div className="content-wrapper">
        <div className="text-content">
          <AvailabilityStatus />
          <HeadingText />
          <SubText />
          <SpotifyCard />
          <CountriesVisitedCard />
        </div>
        <div className="right-content">
          <IdCard />
        </div>
      </div>
      {/* FloatingScrollIndicator removed per request */}
    </div>
  );
};

export default AboutMe;
