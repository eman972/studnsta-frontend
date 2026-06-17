import { useState } from "react";
import { createPost } from "../services/postService";

function AddPostModal({ onClose, onPostCreated }) {
  const [formData, setFormData] = useState({
    content: "",
    subject: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.subject.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const postFormData = new FormData();
      postFormData.append("content", formData.content);
      postFormData.append("subject", formData.subject);

      await createPost(postFormData);
      onPostCreated();
      onClose();
    } catch (error) {
      alert("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div className="glass-card" style={{
        padding: '2.5rem',
        width: '90%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        animation: 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem', 
              fontWeight: '800',
              letterSpacing: '-0.03em',
              lineHeight: '1.2'
            }}>Create Post</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', opacity: 0.8 }}>Share your thoughts with the community</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(249, 250, 251, 0.8)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(243, 244, 246, 0.9)';
              e.target.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(249, 250, 251, 0.8)';
              e.target.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.025em' }}>
              Your Thoughts *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What unique insights do you have today?"
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                minHeight: '120px',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: '#374151',
                transition: 'all 0.2s',
                lineHeight: '1.5',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>


          <div style={{ marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.025em' }}>
                Topic
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this post about?"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff',
                  fontWeight: '500',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.875rem 1.5rem',
                backgroundColor: '#ffffff',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.color = '#374151';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#6b7280';
              }}
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 2,
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isLoading ? 'Sharing...' : 'Share Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPostModal;
