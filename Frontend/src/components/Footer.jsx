import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          Designed & Developed by Shubh Joshi © 2025
        </div>
        <div className="footer-social">
          <a href="https://linkedin.com/in/shubhjoshi" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/shubh186" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="mailto:shubh.joshi@gmail.com" className="social-link" title="Send me an email">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://instagram.com/shubhjoshi_" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://twitter.com/shubh55435927" target="_blank" rel="noopener noreferrer" className="social-link">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
