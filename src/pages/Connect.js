import { useEffect, useState } from "react";
import { getFeed } from "../services/postService";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import SkeletonLoader from "../components/SkeletonLoader";

function Connect() {
  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await getFeed();
      const feedPosts = res.data.posts || [];
      setPosts(feedPosts);
    } catch (error) {
      console.log(error);
      setPosts([]);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePostInteraction = () => {
    fetchFeed(true);
  };

  const handlePostCreated = () => {
    fetchFeed();
  };

  const handleOpenComments = (post) => {
    // Comments are handled within PostCard
    console.log('Comments handled within PostCard');
  };

  return (
    <div className="page-container" style={{
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh',
      backgroundImage: 'url(/connect_bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundColor: 'rgba(10, 11, 30, 0.65)',
      backgroundBlendMode: 'overlay'
    }}>
      {/* Main Content Area: Feed */}
      <div className="flex-col gap-6">
        {/* Header */}
        <div className="glass-card" style={{
          padding: '2.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#ffffff',
                fontSize: '2.2rem', 
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ textShadow: '0 0 20px #a855f7', color: '#c084fc' }}>⚡</span> Community Feed
              </h1>
              <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-secondary)', opacity: 0.9, fontSize: '1rem', fontWeight: '500' }}>
                Join the discussion and share your thoughts
              </p>
            </div>
            <button
              onClick={() => setShowAddPost(true)}
              className="glow-button"
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--brand-500)',
                border: 'none',
                color: 'var(--white)',
                borderRadius: '12px'
              }}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> CREATE POST
            </button>
          </div>
        </div>
          {/* Loading State */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                <SkeletonLoader height="3rem" width="200px" style={{ marginBottom: '1rem' }} />
                <SkeletonLoader height="1rem" count={3} />
              </div>
              <div className="glass-card" style={{ padding: '2rem' }}>
                <SkeletonLoader height="3rem" width="200px" style={{ marginBottom: '1rem' }} />
                <SkeletonLoader height="1rem" count={2} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && posts.length === 0 && (
            <div className="glass-card text-center" style={{
              padding: '5rem 2rem'
            }}>
              <div style={{ fontSize: '6rem', marginBottom: '2.5rem' }}>📝</div>
              <h2 className="text-gradient-lavender" style={{ marginBottom: '1.2rem', fontWeight: '900', fontSize: '2.5rem' }}>Ignite the Discourse</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.8', maxWidth: '480px', margin: '0 auto 3rem', fontSize: '1.15rem', fontWeight: '600' }}>
                No questions yet in this subject. Be the first to ask something!
              </p>
              <button
                onClick={() => setShowAddPost(true)}
                className="glow-button"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
              >
                Create Your First Post
              </button>
            </div>
          )}

          {/* Posts Feed */}
          {!isLoading && posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onInteraction={handlePostInteraction}
              onOpenComments={handleOpenComments}
              isActive={false}
            />
          ))}
      </div>

      {/* Add Post Modal */}
      {showAddPost && (
        <AddPostModal
          onClose={() => setShowAddPost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}

export default Connect;
