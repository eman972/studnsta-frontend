import React, { useState } from 'react';

const PrivacyPolicy = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const policySections = [
    {
      title: "Information We Collect",
      content: "We collect information that you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, and other information you choose to provide."
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, and develop new features, provide customer support to users, authenticate users, and send product updates and administrative messages."
    },
    {
      title: "Cookies and Similar Technologies",
      content: "We use cookies and other identification technologies on our apps, websites, emails, and online ads for purposes such as: authenticating users, remembering user preferences and settings, determining the popularity of content, delivering and measuring the effectiveness of advertising campaigns, and analyzing site traffic and trends."
    },
    {
      title: "Third-Party Links",
      content: "Our services may contain links to third-party websites. If you click on those links, you will leave our services and go to the site you selected. If you visit a third-party website, you should consult that site's privacy policy. We are not responsible for the privacy practices or content of third-party websites."
    },
    {
      title: "Security",
      content: "We are committed to protecting the data of our users. We take appropriate technical and organizational measures to help protect the security of your personal data; however, please note that no system is ever completely secure."
    },
    {
      title: "Your Choices",
      content: "You may correct your account information at any time by logging into your online account. If you wish to cancel your account, please email us. Please note that in some cases we may retain certain information about you as required by law, or for legitimate business purposes to the extent permitted by law."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="page-container" style={{ 
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh', 
      backgroundColor: 'transparent',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem',
          fontWeight: '900',
          letterSpacing: '-0.02em'
        }}>
        Privacy And Policy
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {policySections.map((section, index) => (
          <div 
            key={index} 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '20px',
              border: `1px solid ${activeIndex === index ? 'var(--rich-lavender)' : 'var(--glass-border)'}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeIndex === index ? '0 10px 30px rgba(163, 100, 255, 0.1)' : 'none'
            }}
          >
            <button
              onClick={() => toggleAccordion(index)}
              style={{
                width: '100%',
                padding: '1.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                textAlign: 'left'
              }}
            >
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: activeIndex === index ? 'var(--rich-lavender)' : 'var(--pure-pearl)',
                transition: 'color 0.2s'
              }}>
                {section.title}
              </span>
              <span style={{
                fontSize: '1.5rem',
                color: 'var(--rich-lilac)',
                transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                width: '32px',
                height: '32px',
                borderRadius: '8px'
              }}>
                {activeIndex === index ? '−' : '＋'}
              </span>
            </button>
            
            <div style={{
              maxHeight: activeIndex === index ? '500px' : '0',
              opacity: activeIndex === index ? 1 : 0,
              padding: activeIndex === index ? '0 2rem 1.5rem 2rem' : '0 2rem',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.8',
              fontSize: '1.05rem'
            }}>
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '4rem', 
        textAlign: 'center', 
        padding: '2.5rem',
        borderRadius: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)' }}>
          Have questions? Contact our legal team at <span style={{ color: 'var(--rich-lavender)', fontWeight: '800' }}>legal@studnsta.com</span>
        </p>
      </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
