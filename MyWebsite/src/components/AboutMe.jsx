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
      A software developer / designer / creator
    </div>
  );
};

// Sub-component 3: Sub Text
const SubText = () => {
  return (
    <div className="about-me">
      I specialize in creating innovative solutions that bridge the gap between design and functionality. 
      My projects range from web applications to mobile apps, each crafted with attention to detail and user experience.
      <br /><br />
      Through continuous learning and experimentation, I stay updated with the latest technologies and best practices 
      in software development. I believe in writing clean, maintainable code and building applications that make a difference.
    </div>
  );
};

// Sub-component 4: Spotify Card
const SpotifyCard = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch your Spotify data on component mount
  useEffect(() => {
    fetchSpotifyData();
    
    // Refresh every 30 seconds to keep it current
    const interval = setInterval(fetchSpotifyData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSpotifyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // This will fetch YOUR music data (not the user's)
      // Using the backend server running on port 5000
      const response = await fetch('http://localhost:5000/api/spotify/current-track');
      
      if (response.ok) {
        const data = await response.json();
        setCurrentTrack(data);
      } else {
        // Fallback to showing a default state
        setCurrentTrack({
          name: 'Music not available',
          artist: 'Check back later',
          isPlaying: false
        });
      }
    } catch (err) {
      console.error('Error fetching Spotify data:', err);
      setError('Unable to load music data');
      setCurrentTrack({
        name: 'Music not available',
        artist: 'Check back later',
        isPlaying: false
      });
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className="spotify-card">
      <div className="album-art">
        <div className="album-placeholder">
          <div className="music-note">🎵</div>
        </div>
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
  const [showCountries, setShowCountries] = useState(false);
  
  const countries = [
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'USA', flag: '🇺🇸' },
    { name: 'UK', flag: '🇬🇧' },
    { name: 'Dubai', flag: '🇦🇪' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'Vietnam', flag: '🇻🇳' },
    { name: 'Mauritius', flag: '🇲🇺' }
  ];

  const handleMouseEnter = () => {
    setShowCountries(true);
  };

  const handleMouseLeave = () => {
    setShowCountries(false);
  };

  return (
    <div 
      className="countries-card" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="countries-content">
        <div className="countries-text">
          <div className="countries-title">Places I've been</div>
        </div>
        <div className="countries-icon">
          <div className="location-icon">📍</div>
        </div>
      </div>
      {showCountries && (
        <div className="countries-list">
          {countries.map((country, index) => (
            <div key={index} className="country-item">
              <span className="country-flag">{country.flag}</span>
              <span className="country-name">{country.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Sub-component 6: Floating Scroll Indicator
const FloatingScrollIndicator = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're near the bottom (within 100px)
      const bottomThreshold = documentHeight - windowHeight - 100;
      setIsAtBottom(scrollTop > bottomThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="floating-scroll-indicator">
      <div className="mouse-icon">
        <div className="mouse-body"></div>
        <div className="mouse-wheel"></div>
      </div>
      <div className="scroll-arrows">
        <div className={`scroll-arrow ${isAtBottom ? 'scroll-arrow-up' : ''}`}></div>
        <div className={`scroll-arrow ${isAtBottom ? 'scroll-arrow-up' : ''}`}></div>
      </div>
    </div>
  );
};

// Sub-component 7: ID Card
const IdCard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isSwinging, setIsSwinging] = useState(true); // Start with swinging enabled
  const [stringLength, setStringLength] = useState(60);
  const [hasDownloaded, setHasDownloaded] = useState(false); // Prevent multiple downloads
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const stringRef = useRef(null);

  const downloadResume = () => {
    console.log('Attempting to download development.pdf...');
    
    // Check if the file exists first
    fetch('/development.pdf')
      .then(response => {
        if (response.ok) {
          console.log('Development file found, downloading...');
          const link = document.createElement('a');
          link.href = '/development.pdf';
          link.download = 'development.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('Download initiated');
        } else {
          console.error('Development file not found (404)');
          alert('Development file not found. Please ensure development.pdf is in the public folder.');
        }
      })
      .catch(error => {
        console.error('Error checking development file:', error);
        alert('Error downloading development file. Please check the console for details.');
      });
  };

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setIsSwinging(false);
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
    
    // Download PDF when pulled beyond threshold (100px - reduced for easier testing)
    if (distance > 100 && !hasDownloaded) {
      console.log('PDF download triggered! Distance:', distance);
      setHasDownloaded(true); // Prevent multiple downloads
      downloadResume();
    }
  }, [isDragging, downloadResume]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      // Reset download flag for next drag session
      setHasDownloaded(false);
      
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
  }, [isDragging]);

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
            <img src="/images/me.jpg" alt="Shubh Joshi" />
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
              <span className="label">Phone:</span>
              <span className="value">+1 (555) 123-4567</span>
            </div>
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">San Francisco, CA</span>
            </div>
            <div className="detail-row">
              <span className="label">Experience:</span>
              <span className="value">3+ Years</span>
            </div>
          </div>
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
      <FloatingScrollIndicator />
    </div>
  );
};

export default AboutMe;
