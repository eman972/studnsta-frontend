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
      await createPost({
        content: formData.content,
        subject: formData.subject
      });
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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(163, 100, 255, 0.2)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem', 
              fontWeight: '800',
              letterSpacing: '-0.03em',
              lineHeight: '1.2'
            }}>Create Post</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500', opacity: 0.8 }}>Share your thoughts with the community</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.color = 'var(--white)';
            }}
            onMouseOut={(e) => {
              e.target.style.color = 'var(--text-secondary)';
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.025em' }}>
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
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '1rem',
                minHeight: '120px',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: 'var(--white)',
                transition: 'all 0.2s',
                lineHeight: '1.5',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--brand-500)';
                e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>


          <div style={{ marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.025em' }}>
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
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  fontWeight: '500',
                  color: 'var(--white)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--brand-500)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
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
                background: 'var(--accent-soft)',
                color: 'var(--rich-lavender)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(168, 85, 247, 0.2)';
                e.target.style.color = 'var(--white)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'var(--accent-soft)';
                e.target.style.color = 'var(--rich-lavender)';
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
                background: 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
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
