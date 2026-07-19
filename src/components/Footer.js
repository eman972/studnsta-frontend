import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    followUs: [
      { name: 'Instagram', icon: '📸', url: '#' },
      { name: 'Facebook', icon: '👤', url: '#' },
      { name: 'Twitter', icon: '🐦', url: '#' },
      { name: 'Email', icon: '📧', url: 'mailto:support@studnsta.com' }
    ],
    forStudents: [
      { name: 'Dashboard', url: '/home' },
      { name: 'Community Connect', url: '/connect' },
      { name: 'Study Notes', url: '/notes' },
      { name: 'Practice Quiz', url: '/quiz-setup' },
      { name: 'AI Tutor', url: '/ai-tutor' },
      { name: 'My Progress', url: '/progress' },
    ],
    forTeachers: [
      { name: 'Create Live Quiz', url: '/live-quiz-setup' },
      { name: 'Upload Study Notes', url: '/notes' },
      { name: 'Privacy Policy', url: '/privacy' }
    ]
  };

  return (
    <footer style={{
      backgroundColor: '#1A0B2E', // Deep Dark Violet
      color: 'var(--white)',
      padding: '4rem 2rem 2rem 2rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(163, 100, 255, 0.1)',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Follow Us Section */}
        <div>
          <h3 style={{
            color: 'var(--rich-lilac)',
            fontSize: '1.4rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Follow Us
          </h3>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {footerSections.followUs.map((social) => (
              <a 
                key={social.name} 
                href={social.url}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(163, 100, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  color: 'var(--rich-lilac)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(163, 100, 255, 0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--rich-lilac)';
                  e.currentTarget.style.color = 'var(--white)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(163, 100, 255, 0.15)';
                  e.currentTarget.style.color = 'var(--rich-lilac)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p style={{ marginTop: '2rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Join our growing community of learners and stay updated with the latest study resources.
          </p>
        </div>

        {/* For Students Section */}
        <div>
          <h3 style={{
            color: 'var(--rich-lilac)',
            fontSize: '1.4rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: "'Outfit', sans-serif"
          }}>
            For Students
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {footerSections.forStudents.map((link) => (
              <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                <Link 
                  to={link.url}
                  style={{
                    color: 'rgba(250, 250, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = 'var(--rich-lilac)';
                    e.target.style.transform = 'translateX(5px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'rgba(250, 250, 255, 0.7)';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Teachers Section */}
        <div>
          <h3 style={{
            color: 'var(--rich-lilac)',
            fontSize: '1.4rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: "'Outfit', sans-serif"
          }}>
            For Teachers
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {footerSections.forTeachers.map((link) => (
              <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                <Link 
                  to={link.url}
                  style={{
                    color: 'rgba(250, 250, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = 'var(--rich-lilac)';
                    e.target.style.transform = 'translateX(5px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'rgba(250, 250, 255, 0.7)';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand/About Section */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ 
            fontSize: '2.2rem', 
            fontWeight: '950', 
            background: 'linear-gradient(135deg, var(--rich-lilac), #FFFFFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.05em'
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img src="/logo_neon_transparent.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div> STUDNSTA
          </div>
          <p style={{ color: 'rgba(250, 250, 255, 0.6)', fontSize: '1rem', maxWidth: '320px', lineHeight: '1.7', fontWeight: '500' }}>
            Empowering students with accessible academic notes and a collaborative community. Step into the future of learning.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0 auto',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.4)',
          fontWeight: '500'
        }}>
          © {currentYear} <span style={{ color: 'var(--rich-lilac)', fontWeight: '700' }}>Studnsta</span> — All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
