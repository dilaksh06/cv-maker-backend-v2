// backend/templates/jsx/ResumeTemplate.jsx
// This file looks good for a React component meant to be a default export.

const ResumeTemplate = ({
  personalInfo = {}, // Default to empty object to prevent errors if undefined
  aboutMe = "",
  hardSkills = [],
  languages = [],
  workExperience = [],
  academicQualifications = [],
  projects = [],
  publications = [],
  recommendations = [],
}) => {
  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-section">
          <h1 className="profile-name">{personalInfo.name}</h1>
          <div className="profile-title">Executive Professional</div>{" "}
          {/* This was a static string in EJS */}
        </div>

        <div className="sidebar-heading">Contact</div>
        {personalInfo.email && (
          <div className="contact-item">
            <span className="contact-label">Email:</span> {personalInfo.email}
          </div>
        )}
        {personalInfo.phoneNumbers && personalInfo.phoneNumbers.length > 0 && (
          <div className="contact-item">
            <span className="contact-label">Phone:</span>{" "}
            {personalInfo.phoneNumbers.join(", ")}
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="contact-item">
            <span className="contact-label">LinkedIn:</span>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        )}
        {personalInfo.portfolio && (
          <div className="contact-item">
            <span className="contact-label">Portfolio:</span>
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          </div>
        )}
        {personalInfo.github && (
          <div className="contact-item">
            <span className="contact-label">GitHub:</span>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        )}
        {personalInfo.address && (
          <div className="contact-item">
            <span className="contact-label">Address:</span>{" "}
            {personalInfo.address}
          </div>
        )}

        {hardSkills.length > 0 && (
          <div className="skills-section">
            <div className="sidebar-heading">Core Competencies</div>
            {hardSkills.map((skill, index) => (
              <div className="skill-item" key={index}>
                {skill}
              </div>
            ))}
          </div>
        )}

        {languages.length > 0 && (
          <div className="languages-section">
            <div className="sidebar-heading">Languages</div>
            {languages.map((language, index) => (
              <div className="language-item" key={index}>
                {language}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {aboutMe && (
          <div className="section">
            <div className="section-title">Executive Summary</div>
            <div className="summary-content">{aboutMe}</div>
          </div>
        )}

        {workExperience.length > 0 && (
          <div className="section">
            <div className="section-title">Professional Experience</div>
            {workExperience.map((experience, index) => (
              <div className="experience-item" key={index}>
                <div className="job-header">
                  <div>
                    <div className="job-title">{experience.jobTitle}</div>
                    <div className="job-company">{experience.supervisor}</div>
                    <div>
                      {experience.city}, {experience.country}
                    </div>
                  </div>
                  <div>{experience.dateRange}</div>
                </div>
                {experience.responsibilities &&
                  experience.responsibilities.length > 0 && (
                    <ul className="responsibilities">
                      {experience.responsibilities.map((item, respIndex) => (
                        <li key={respIndex}>{item}</li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
          </div>
        )}

        {academicQualifications.length > 0 && (
          <div className="section">
            <div className="section-title">Education</div>
            {academicQualifications.map((edu, index) => (
              <div className="education-item" key={index}>
                <div className="degree-header">
                  <div className="degree-title">{edu.degree}</div>
                  <div>{edu.dateRange}</div>
                </div>
                <div className="institution">{edu.institution}</div>
                {(edu.website ||
                  (edu.additionalLinks && edu.additionalLinks.length > 0)) && (
                  <ul className="education-links">
                    {edu.website && (
                      <li>
                        <a
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      </li>
                    )}
                    {edu.additionalLinks &&
                      edu.additionalLinks.length > 0 &&
                      edu.additionalLinks.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            More
                          </a>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="section">
            <div className="section-title">Projects</div>
            {projects.map((project, index) => (
              <div className="project-item" key={index}>
                <div className="project-title">{project.title}</div>
                {project.description && <div>{project.description}</div>}
                {project.languages && project.languages.length > 0 && (
                  <div>
                    <strong>Technologies:</strong>{" "}
                    {project.languages.join(", ")}
                  </div>
                )}
                {project.algorithms && project.algorithms.length > 0 && (
                  <div>
                    <strong>Methods:</strong> {project.algorithms.join(", ")}
                  </div>
                )}
                {project.links && project.links.length > 0 && (
                  <ul className="project-links">
                    {project.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {publications.length > 0 && (
          <div className="section">
            <div className="section-title">Publications</div>
            {publications.map((pub, index) => (
              <div className="publication-item" key={index}>
                <div className="publication-title">
                  {pub.title}
                  {pub.year && (
                    <span className="publication-year"> ({pub.year})</span>
                  )}
                </div>
                {pub.description && <div>{pub.description}</div>}
                {pub.link && (
                  <a
                    href={pub.link}
                    className="publication-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Publication
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="section">
            <div className="section-title">References</div>
            {recommendations.map((ref, index) => (
              <div className="reference-item" key={index}>
                <div className="reference-name">{ref.name}</div>
                {(ref.profession || ref.institute) && (
                  <div className="reference-position">
                    {ref.profession} {ref.institute && `at ${ref.institute}`}
                  </div>
                )}
                <div className="reference-contact">
                  {ref.phone && (
                    <div>
                      <strong>Phone:</strong> {ref.phone}
                    </div>
                  )}
                  {ref.email && (
                    <div>
                      <strong>Email:</strong> {ref.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate;
