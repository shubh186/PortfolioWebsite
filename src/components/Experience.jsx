import React, { useState, useMemo } from 'react';
import '../App.css';

// Sub-component 1: iPhone Screen
const IPhoneScreen = ({ apps, onAppClick }) => {
  return (
    <div className="iphone-screen">
      <div className="iphone-content">
        <div className="apps-grid">
          {apps.map((app) => (
            <div key={app.id} className="app-container">
              <div 
                className={`app-icon ${app.id}`}
                onClick={() => onAppClick(app)}
              >
                <span style={{ fontSize: '24px' }}>{app.icon}</span>
              </div>
              <div className="app-label">{app.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component 2: Contact Form
const ContactForm = ({ formData, isSubmitting, submitMessage, onInputChange, onSubmit }) => {
  return (
    <div className="contact-form-section">
      <h2 className="contact-form-title">Let's Connect!</h2>
      <p className="contact-form-subtitle">
      Interested in creating something meaningful together? Think I could bring value to your business? Let’s connect!
      </p>
      <form className="contact-form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="reason"
            placeholder="Reason for reaching out..."
            value={formData.reason}
            onChange={onInputChange}
            rows="4"
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        {submitMessage && (
          <div className={`submit-message ${submitMessage.includes('Thank you') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

// Sub-component 3: App Popup
const AppPopup = ({ selectedApp, onClose }) => {
  if (!selectedApp) return null;
  
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="project-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>
            <span style={{ marginRight: '15px' }}>{selectedApp.icon}</span>
            {selectedApp.title}
          </h2>
          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="popup-content">
          {selectedApp.content.company && (
            <div className="project-description">
              <strong>Company:</strong> {selectedApp.content.company}
            </div>
          )}
          {selectedApp.content.role && (
            <div className="project-description">
              <strong>Role:</strong> {selectedApp.content.role}
            </div>
          )}
          {selectedApp.content.degree && (
            <div className="project-description">
              <strong>Degree:</strong> {selectedApp.content.degree}
            </div>
          )}
          {selectedApp.content.school && (
            <div className="project-description">
              <strong>School:</strong> {selectedApp.content.school}
            </div>
          )}
          {selectedApp.content.title && (
            <div className="project-description">
              <strong>Title:</strong> {selectedApp.content.title}
            </div>
          )}
          <div className="project-description">
            <strong>Period:</strong> {selectedApp.content.period}
          </div>

        </div>
      </div>
    </div>
  );
};

// Main Experience Component
const Experience = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Apps for the iPhone
  const apps = useMemo(() => [
    { 
      id: 'work1', 
      title: 'Work Experience', 
      icon: '💼',
      content: {
        company: 'Prep Doctors Corp',
        role: 'Software Developer | Product Manager | Product Owner',
        period: '01/24 – Present',
        points: ['Developing scalable systems', 'API Development', 'LLM', 'Led team of 3 developers',]
      }
    },
    { 
      id: 'work2', 
      title: 'Work Experience', 
      icon: '💼',
      content: {
        company: 'Sun Life Financial',
        role: 'Software Developer',
        period: '01/22 – 08/22',
        points: ['Built scalable React applications', 'Designed REST APIs', 'Optimized database performance', 'Led team of 3 developers']
      }
    },
    { 
      id: 'work3', 
      title: 'Work Experience', 
      icon: '💼',
      content: {
        company: 'CIBC',
        role: 'Application Developer',
        period: '05/20 – 12/20',
        points: ['Built scalable React applications', 'Designed REST APIs', 'Optimized database performance', 'Led team of 3 developers']
      }
    },
    { 
      id: 'education', 
      title: 'Education', 
      icon: '🎓',
      content: {
        degree: 'Bachelor of Computng - Honours Computer Science',
        school: 'University of Guelph',
        period: '2018 – 2023',
        points: ['GPA: 3.4/4.0', 'Dean\'s List 3 semesters', 'Senior Capstone Project', 'Relevant Coursework: Data Structures, Algorithms, Database Systems']
      }
    },
    { 
      id: 'todo', 
      title: 'Todo', 
      icon: '📝',
      content: {
        title: 'Todo List',
        period: 'Complete AI Chatbot by end of 2025',
        points: ['Complete portfolio website', 'Learn new technologies', 'Contribute to open source', 'Build side projects']
      }
    },
    { 
      id: 'volunteering', 
      title: 'Volunteering', 
      icon: '🤝',
      content: {
        title: 'Tech Consultant - Shrimad Rajchandra Mission Dharampur',
        period: '2018 – Present',
        points: ['Mentored junior developers', 'Taught coding workshops', 'Organized tech meetups', 'Contributed to community projects']
      }
    }
  ], []);

  // App click handler
  const handleAppClick = (app) => {
    setSelectedApp(app);
  };

  // Contact form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage(result.message);
        setFormData({ name: '', email: '', reason: '' });
      } else {
        setSubmitMessage(result.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="skills-tag">Experience</div>
      <div className="skills-subtitle">Interact with my apps! 🫰</div>
      <div className="experience-content-wrapper">
        <IPhoneScreen apps={apps} onAppClick={handleAppClick} />
        <ContactForm 
          formData={formData}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          onInputChange={handleInputChange}
          onSubmit={handleFormSubmit}
        />
      </div>
      <AppPopup selectedApp={selectedApp} onClose={() => setSelectedApp(null)} />
    </section>
  );
};

export default Experience;
