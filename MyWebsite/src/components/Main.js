import React, { useState, useEffect } from 'react';
import { Honeycomb, Hexagon } from 'react-honeycomb';
import { 
  faSeedling, 
  faChess, 
  faOm, 
  faComputer, 
  faTerminal, 
  faBrain, 
  faRobot, 
  faNetworkWired, 
  faGraduationCap, 
  faHandsHelping 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AboutMe from './AboutMe';
import Skills from './Skills';
import Experience from './Experience';
import './Main.css';

function Main() {
  // State for managing project popup
  const [openCard, setOpenCard] = useState(null);

  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenCard(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Project data for honeycomb grid
  const projectData = [
    {
      id: 'meditation',
      icon: faOm,
      title: 'Meditation App',
      description: 'A peaceful meditation application with guided sessions and mindfulness exercises.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'garden',
      icon: faSeedling,
      title: 'Garden Tracker',
      description: 'Track your plants growth and get personalized care recommendations.',
      technologies: ['React Native', 'Firebase', 'ML Kit'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'chess',
      icon: faChess,
      title: 'Chess Engine',
      description: 'An intelligent chess game with AI opponent and move analysis.',
      technologies: ['Python', 'TensorFlow', 'Flask'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'portfolio',
      icon: faComputer,
      title: 'Portfolio Website',
      description: 'This very website - a responsive portfolio showcasing my projects and skills.',
      technologies: ['React', 'CSS3', 'JavaScript'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'terminal',
      icon: faNetworkWired,
      title: 'Neural Network',
      description: 'A deep learning neural network implementation with real-time training visualization.',
      technologies: ['Python', 'TensorFlow', 'Keras'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'rocket',
      icon: faBrain,
      title: 'AI Data Insights',
      description: 'Interactive dashboards and visualizations for exploring datasets with AI-powered analytics.',
      technologies: ['React', 'D3.js', 'Python', 'TensorFlow'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'gamepad',
      icon: faHandsHelping,
      title: 'Volunteer Platform',
      description: 'A community platform connecting volunteers with local organizations and causes.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'insights',
      icon: faGraduationCap,
      title: 'Learning Management System',
      description: 'A comprehensive LMS platform with course management, student tracking, and interactive learning modules.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      githubLink: '#',
      liveLink: '#',
      status: 'dev'
    },
    {
      id: 'cli-tools',
      icon: faRobot,
      title: 'ML CLI Tools',
      description: 'Handy developer utilities packaged as cross-platform CLI tools.',
      technologies: ['Node.js', 'TypeScript'],
      githubLink: '#',
      liveLink: '#',
      status: 'dev'
    }
  ];

  // Toggle project popup
  const toggleCard = (cardId) => {
    console.log('Hexagon clicked:', cardId);
    console.log('Current openCard:', openCard);
    setOpenCard(openCard === cardId ? null : cardId);
    console.log('Setting openCard to:', openCard === cardId ? null : cardId);
  };

  // Handle keyboard navigation for hexagons
  const handleHexKeyDown = (e, cardId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCard(cardId);
    }
  };

  return (
    <div className="main-container">
      {/* About Me Section */}
      <AboutMe />

      {/* Projects Section */}
      <section className="page-section">
        <div className="skills-tag">Projects</div>

        <div className="projects-content-wrapper">
          {/* Honeycomb Grid */}
          <div className="honeycomb-container">
            <Honeycomb
              columns={3}
              size={120}
              items={projectData}
              renderItem={(project, index) => (
                <Hexagon
                  key={project.id}
                  className={`project-hexagon ${project.status === 'dev' ? 'dev-hexagon' : ''}`}
                  data-selected={openCard === project.id || undefined}
                  role="button"
                  tabIndex={0}
                  aria-label={`${project.title} details`}
                >
                  <div 
                    className="hex-content"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Hex content clicked for:', project.id);
                      toggleCard(project.id);
                    }}
                    onKeyDown={(e) => handleHexKeyDown(e, project.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <FontAwesomeIcon 
                      icon={project.icon} 
                      size="3x" 
                      className="hexagon-icon"
                    />
                  </div>
                </Hexagon>
              )}
            />
          </div>

          {/* About My Work Text Section */}
          <div className="text-section">
            <h2 className="text-section-title">About My Work</h2>
            <p className="text-section-content">
              I specialize in creating innovative solutions that bridge the gap between design and functionality. 
              My projects range from web applications to mobile apps, each crafted with attention to detail and user experience.
            </p>
            <p className="text-section-content">
              Through continuous learning and experimentation, I stay updated with the latest technologies and best practices 
              in software development. I believe in writing clean, maintainable code and building applications that make a difference.
            </p>
          </div>
        </div>

        {/* Project Popup Modal */}
        {openCard && (
          <div className="popup-overlay" onClick={() => setOpenCard(null)}>
            <div className="project-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2>
                  <FontAwesomeIcon 
                    icon={projectData.find(p => p.id === openCard)?.icon} 
                    style={{ marginRight: '15px' }} 
                  />
                  {projectData.find(p => p.id === openCard)?.title}
                </h2>
                <button 
                  className="close-btn" 
                  onClick={() => setOpenCard(null)}
                >
                  ×
                </button>
              </div>
              <div className="popup-content">
                <p className="project-description">
                  {projectData.find(p => p.id === openCard)?.description}
                </p>
                <div className="technologies">
                  <h4>Technologies Used:</h4>
                  <div className="tech-tags">
                    {projectData.find(p => p.id === openCard)?.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="project-links">
                  <a 
                    href={projectData.find(p => p.id === openCard)?.githubLink} 
                    className="project-link github"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faTerminal} />
                    View Code
                  </a>
                  <a 
                    href={projectData.find(p => p.id === openCard)?.liveLink} 
                    className="project-link live"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faComputer} />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Skills Section */}
      <Skills />

      {/* Experience Section */}
      <Experience />
    </div>
  );
}

export default Main;
