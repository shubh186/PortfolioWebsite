import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram, faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if scrolled past 50px
      setIsScrolled(scrollTop > 50);

      // Check if footer is visible (when scroll position + window height is close to document height)
      const footerThreshold = documentHeight - windowHeight - 100; // 100px buffer
      setIsFooterVisible(scrollTop > footerThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isFooterVisible ? 'hidden' : ''}`}>
      <div className="header-content">
        <div className="header-social">
          <a href="https://linkedin.com/in/shubhjoshi" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/shubhjoshi" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="mailto:shubh.joshi@gmail.com" className="social-link">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://instagram.com/shubhjoshi" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://discord.gg/shubhjoshi" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a href="https://twitter.com/shubhjoshi" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
