import { useState } from "react";
import { likePost, commentOnPost, savePost } from "../services/postService";

function PostCard({ post, onInteraction, onOpenComments, isActive }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePost(post._id);
      onInteraction();
    } catch (error) {
      alert("Failed to save post: " + (error.response?.status || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await likePost(post._id);
      onInteraction();
    } catch (error) {
      alert("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };



  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsCommenting(true);
    try {
      await commentOnPost(post._id, commentText);
      setCommentText("");
      onInteraction();
    } catch (error) {
      alert("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };



  const isLiked = post.likes.some(like => (like._id || like) === localStorage.getItem("userId"));
  const isSaved = post.saves && post.saves.some(save => (save._id || save) === localStorage.getItem("userId"));

  return (
    <div className="glass-card" style={{
      marginBottom: '2.5rem',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      border: isActive ? '2px solid var(--rich-lavender)' : '1px solid var(--glass-border)',
      transform: isActive ? 'translateX(12px) scale(1.02)' : 'none',
      boxShadow: isActive ? '0 30px 60px rgba(163, 100, 255, 0.2)' : 'var(--card-shadow)',
      background: 'rgba(250, 250, 255, 0.8)',
      borderRadius: 'var(--border-radius-lg)'
    }}>
      {/* Post Header */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: post.author.avatar ? 'transparent' : 'var(--rich-lavender)',
            backgroundImage: post.author.avatar ? `url(http://localhost:5000${post.author.avatar})` : 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '900',
            fontSize: '1.3rem',
            boxShadow: '0 6px 15px rgba(163, 100, 255, 0.3)',
            overflow: 'hidden'
          }}>
            {!post.author.avatar && (post.author.name.charAt(0).toUpperCase())}
          </div>
          <div>
            <div style={{ fontWeight: '800', color: 'var(--text-dark)', fontSize: '1.1rem' }}>{post.author.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--rich-lavender)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {post.author.role}
            </div>
          </div>
        </div>
        </div>

      {/* Post Image */}
      {post.image && (
        <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', backgroundColor: 'var(--bg-light)' }}>
          <img 
            src={`http://localhost:5000${post.image}`}
            alt="Post Content"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {/* Post Content */}
      <div style={{ padding: '1.75rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          {[
            { text: post.subject, bg: '#FDF9FF', color: 'var(--rich-lavender)' },
            { text: post.topic, bg: 'var(--white)', color: 'var(--text-muted)' }
          ].map((tag, idx) => (
            <span key={idx} style={{
              backgroundColor: tag.bg,
              color: tag.color,
              padding: '0.4rem 1rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: '800',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              border: `1px solid var(--border-color)`
            }}>
              {tag.text}
            </span>
          ))}
        </div>
        
        <p style={{ 
          color: 'var(--text-dark)', 
          lineHeight: '1.8', 
          marginBottom: '1.75rem', 
          fontSize: '1.1rem',
          whiteSpace: 'pre-wrap',
          fontWeight: '500'
        }}>
          {post.content}
        </p>

        {/* Interaction Buttons */}
        <div style={{
          display: 'flex',
          gap: '1.75rem',
          padding: '1.25rem 0 0 0',
          borderTop: '2.5px solid var(--accent-soft)',
        }}>
          <button
            onClick={handleLike}
            disabled={isLiking}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: isLiking ? 'not-allowed' : 'pointer',
              color: isLiked ? '#FF3D71' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '12px',
              transition: 'all 0.2s',
              fontWeight: '700'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-soft)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '1.6rem' }}>{isLiked ? '💖' : '🤍'}</span> 
            <span style={{ fontSize: '1rem' }}>{post.likes.length}</span>
          </button>
          
          <button
            onClick={onOpenComments}
            style={{
              background: isActive ? 'rgba(182, 102, 210, 0.1)' : 'none',
              border: isActive ? '1px solid var(--rich-lilac)' : 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: isActive ? 'var(--rich-lilac)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'rgba(182, 102, 210, 0.05)')}
            onMouseOut={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span style={{ fontSize: '1.4rem' }}>💬</span> 
            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{post.comments.length}</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              color: isSaved ? '#F59E0B' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '12px',
              transition: 'all 0.2s',
              fontWeight: '700',
              marginLeft: 'auto'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-soft)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '1.6rem' }}>{isSaved ? '📌' : '📍'}</span> 
            <span style={{ fontSize: '1rem' }}>{post.saves ? post.saves.length : 0}</span>
          </button>
        </div>

        {/* Comment Entry Area (Quick Ref) */}
        <div style={{ marginTop: '1.5rem' }}>
            <form onSubmit={handleComment} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Say something nice..."
                className="input-field"
                style={{ flex: 1, padding: '0.75rem 1rem' }}
              />
              <button
                type="submit"
                disabled={isCommenting}
                className="glow-button"
                style={{
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.9rem',
                }}
              >
                {isCommenting ? '...' : 'Post'}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
