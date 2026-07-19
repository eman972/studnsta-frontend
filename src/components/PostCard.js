import { useState } from "react";
import { likePost, commentOnPost, savePost } from "../services/postService";
import { BASE_URL } from "../services/api";

function PostCard({ post, onInteraction, onOpenComments, isActive }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);

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
    <div style={{
      marginBottom: '2.5rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '580px',
      width: '100%',
    }}>
      <div className="glass-card" style={{
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: isActive ? '2px solid var(--rich-lavender)' : '1px solid #ffffff',
        transform: isActive ? 'translateX(12px) scale(1.02)' : 'none',
        boxShadow: isActive ? '0 30px 60px rgba(163, 100, 255, 0.2)' : 'var(--card-shadow)',
        background: 'var(--dark-bg)',
        borderRadius: '24px'
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
            borderRadius: '50%',
            border: '2px solid #a855f7',
            backgroundColor: post.author.avatar ? 'transparent' : 'var(--rich-lavender)',
            backgroundImage: post.author.avatar ? `url(${BASE_URL}${post.author.avatar})` : 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '900',
            fontSize: '1.3rem',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
            overflow: 'hidden'
          }}>
            {!post.author.avatar && (post.author.name.charAt(0).toUpperCase())}
          </div>
          <div>
            <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '1.1rem' }}>{post.author.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#ffffff', backgroundColor: '#a855f7', padding: '0.2rem 0.6rem', borderRadius: '20px', display: 'inline-block', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem', boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)' }}>
              {post.author.role}
            </div>
          </div>
        </div>
        </div>

      {/* Post Image */}
      {post.image && (
        <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', backgroundColor: 'var(--bg-light)' }}>
          <img 
            src={`${BASE_URL}${post.image}`}
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
          ]
          .filter(tag => tag.text && tag.text.trim() !== '')
          .map((tag, idx) => (
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
          color: '#ffffff', 
          lineHeight: '1.8', 
          marginBottom: '1.75rem', 
          fontSize: '1.1rem',
          whiteSpace: 'pre-wrap',
          fontWeight: '500'
        }}>
          {post.content}
        </p>



        {/* Comments Section */}
        {isCommentsVisible && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={comment._id || index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: comment.user?.avatar ? 'transparent' : 'var(--rich-lilac)',
                      backgroundImage: comment.user?.avatar ? `url(${BASE_URL}${comment.user.avatar})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '0.9rem'
                    }}>
                      {!comment.user?.avatar && (comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : '?')}
                    </div>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>
                      {comment.user?.name || 'Unknown User'}
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                No comments yet. Be the first to reply!
              </div>
            )}
          </div>
        )}

        {/* Comment Entry Area (Quick Ref) */}
        <div style={{ marginTop: '1.5rem' }}>
            <form onSubmit={handleComment} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Join the discussion"
                className="input-field"
                style={{ 
                  flex: 1, 
                  padding: '0.75rem 1rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  borderRadius: '20px'
                }}
              />
              <button
                type="submit"
                disabled={isCommenting}
                className="glow-button"
                style={{
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  background: 'var(--brand-500)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '20px'
                }}
              >
                {isCommenting ? '...' : 'POST'}
              </button>
            </form>
        </div>
      </div>
      </div>

      {/* Interaction Buttons */}
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        padding: '1rem 1.5rem',
      }}>
        <button
          onClick={handleLike}
          disabled={isLiking}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: isLiking ? 'not-allowed' : 'pointer',
            color: isLiked ? '#FF3D71' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0',
            transition: 'all 0.2s',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill={isLiked ? "#FF3D71" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s', transform: isLiking ? 'scale(1.2)' : 'scale(1)' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span style={{ fontSize: '1rem' }}>{post.likes.length > 0 ? post.likes.length : ''}</span>
        </button>
        
        <button
          onClick={() => {
            setIsCommentsVisible(!isCommentsVisible);
            if (onOpenComments) onOpenComments();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0',
            transition: 'all 0.2s',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span style={{ fontSize: '1rem' }}>{post.comments.length > 0 ? post.comments.length : ''}</span>
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0',
            transition: 'all 0.2s',
            fontWeight: '600',
            marginLeft: 'auto'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill={isSaved ? "#ffffff" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s', transform: isSaving ? 'scale(1.2)' : 'scale(1)' }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

    </div>
  );
}

export default PostCard;
