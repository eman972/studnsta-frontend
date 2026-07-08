import { useEffect, useState } from "react";
import { getFeed } from "../services/postService";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";

function Home() {
  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await getFeed();
      const feedPosts = res.data.posts || [];
      setPosts(feedPosts);
    } catch (error) {
      console.log(error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePostInteraction = () => {
    fetchFeed();
  };

  const handlePostCreated = () => {
    fetchFeed();
  };

  const handleOpenComments = (post) => {
    // Since we removed sidebar, comments are handled within PostCard
    console.log('Comments handled within PostCard');
  };

  return (
    <div className="page-container">
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
                background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.2rem', 
                fontWeight: '900'
              }}>
                🌟 Community Feed
              </h1>
              <p style={{ margin: '0.4rem 0 0 0', color: 'var(--midnight-charcoal)', opacity: 0.7, fontSize: '1rem', fontWeight: '500' }}>
                Join the discussion and share your thoughts
              </p>
            </div>
            <button
              onClick={() => setShowAddPost(true)}
              className="glow-button"
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>➕</span> Create Post
            </button>
          </div>
        </div>
          {/* Loading State */}
          {isLoading && (
            <div className="text-center" style={{ padding: '5rem' }}>
              <div className="flex-col items-center gap-6" style={{ 
                fontSize: '1.2rem', 
                color: 'var(--rich-lilac)', 
                fontWeight: '700'
              }}>
                <div style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>⏳</div>
                Gathering amazing notes for you...
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

export default Home;