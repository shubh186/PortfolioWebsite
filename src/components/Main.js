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
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 480) {
        setColumns(1);   // stack vertically on very small screens
      } else if (window.innerWidth < 768) {
        setColumns(2);   // tablet
      } else {
        setColumns(3);   // desktop
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

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
      id: 'Jain',
      icon: faOm,
      title: 'Jain Bites',
      description: 'Developed a cross-platform mobile application to address the lack of vegetarian and Jain food options across the Greater Toronto Area. Currently available on Android and iOS, garnered a user base of over 2000 users.',
      technologies: ['JavaScript', 'HTML/CSS', 'Google Maps API', 'Git', 'Firebase', 'Apache Cordova', 'Google Sheets API'],
      githubLink: 'https://github.com/shubh186/JainFoodApp',
    },
    {
      id: 'Plant',
      icon: faSeedling,
      title: 'Bloom Buddy',
      description: ' Expiremented and developed a mobile application to track plant growth and get personalized plant care recommendations — designed to rekindle interest in plant care and address the growing decline in plant nurturing habits.',
      technologies: ['Flutter', 'Dart', 'Git'],
      githubLink: 'https://github.com/shubh186/BloomBuddy',
    },
    {
      id: 'Chess',
      icon: faChess,
      title: 'Chess',
      description: ' Developed and optimized an intelligent chess game with an AI opponent and move analysis.',
      technologies: ['Python'],
      githubLink: 'https://github.com/shubh186/Chess-AI',
    },
    {
      id: 'Portfolio',
      icon: faComputer,
      title: 'Portfolio Website',
      description: 'This very website - a responsive portfolio showcasing my creativity and skills.',
      technologies: ['React,js', 'Node.js', 'Express.js', 'JavaScript', 'MSSQL', 'API Integration', 'HTML5/CSS3', 'Git'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'NeuralNetwork',
      icon: faNetworkWired,
      title: 'Neural Network',
      description: 'Developed a feedforward neural network from scratch using NumPy to analyze the MNIST dataset with real-time training visualization.',
      technologies: ['Python'],
      githubLink: 'https://github.com/shubh186/Artificial-Neural-Network',
    },
    {
      id: 'Chatbot',
      icon: faBrain,
      title: 'AI Chatbot',
      description: 'Currently developing a front desk chatbot/voicebot that can answer calls + book appointments into Google Calendar. Will further implement integration into varied booking systems.',
      technologies: ['OpenAI', 'Pinecone', 'Langchain', 'Python', 'Google Calendar API', 'NLP', 'STT', 'Git', 'Docker', 'Kubernetes', 'React.js', 'Node.js'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'SRLC/SRMD',
      icon: faHandsHelping,
      title: 'Technology Consultant',
      description: 'Serving as a Technology Consultant for Shrimad Rajchandra Mission Dharampur (non-profit), where I develop and manage projects that leverage technology to create a meaningful impact within our society. Passionate about using tech as a force for good to make a real difference in the world.',
      technologies: ['Zoho', 'Javascript', 'HTML/CSS', 'Python', 'Product Management'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'PrepX',
      icon: faGraduationCap,
      title: 'Learning Management System',
      description: 'Architected and developed a 20-microservice Medical Examination & Learning Management Platform, leading the full lifecycle from system design and product strategy to development, testing, and DevOps. Managed and coordinated cross-functional teams to deliver a scalable, high-performance solution supporting complex medical assessments and learning workflows. ',
      technologies: ['React.js', 'Node.js', 'Next.js', 'Kubernetes', 'Docker', 'MySQL', 'Redis', 'socket.IO', 'API Integration', 'Git'],
      githubLink: '#',
      liveLink: '#'
    },
    {
      id: 'Automation Scripts',
      icon: faRobot,
      title: 'Automation Scripts',
      description: 'I frequently develop automation scripts to streamline workflows, boost productivity, and even simplify tasks for family and friends. One notable project is a development time tracker: an automation that detects when I open my designated IDE to begin coding and when I close it to end a session. The data is automatically logged and integrated with my Google Calendar, giving me precise insights into how much time I spend coding each week.',
      technologies: ['Python', 'Google Calendar API', 'Git'],
      githubLink: '#',
      liveLink: '#',
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
              columns={columns}
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
            My projects are a direct reflection of who I am. My mind wanders, and I actively step into different worlds to understand others’ challenges and perspectives. That curiosity has led me to explore automation, mobile development, software engineering, and AI/ML — each project aiming to address real-world problems in its own way.
            </p>
            <p className="text-section-content">
            Every build carries meaning. Even if it’s interpreted differently by others, to me it’s part of a growing beehive of ideas and achievements. I don’t just create products — I create stories.
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
                    className="project-link live"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faTerminal} />
                    View Code
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
