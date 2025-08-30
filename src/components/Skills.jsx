import React from 'react';
import '../App.css';

const Skills = () => {
  const skillsData = {
    languages: ['Python', 'JavaScript', 'C/C++', 'Java', 'PowerShell', 'Dart'],
    frameworks: ['React.js', 'Node.js', 'Next.js', 'Express.js', 'Azure Cloud', 'MySQL', 'MSSQL', 'PostgreSQL', 'MongoDB', 'Flutter', 'Selenium', 'Apache JMeter', 'REST API'],
    tools: ['Git', 'GitHub', 'Azure Pipelines', 'DevOps', 'VS Code', 'Google APIs', 'LLMs', 'Zapier', 'Postman', 'Docker']
  };

  return (
    <section className="page-section">
      <div className="skills-tag">Skills</div>
      <div className="skills-subtitle">I may have learned a thing or few 🤷‍♂️</div>
      <div className="skills-screen">
        <div className="skills-screen-content">
          <div className="keyboard-layout">
            {/* Top row - Languages */}
            <div className="keyboard-row">
              <div className="keyboard-section-label">Languages</div>
              <div className="keyboard-keys">
                {skillsData.languages.map((skill, index) => (
                  <div key={index} className="keyboard-key language-key">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Middle row - Frameworks */}
            <div className="keyboard-row">
              <div className="keyboard-section-label">Frameworks & Technologies</div>
              <div className="keyboard-keys">
                {skillsData.frameworks.map((skill, index) => (
                  <div key={index} className="keyboard-key framework-key">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row - Tools */}
            <div className="keyboard-row">
              <div className="keyboard-section-label">Tools</div>
              <div className="keyboard-keys">
                {skillsData.tools.map((skill, index) => (
                  <div key={index} className="keyboard-key tool-key">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
