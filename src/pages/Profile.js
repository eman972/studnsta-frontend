import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserProfile, uploadAvatar } from "../services/profileService";
import { getSavedPosts } from "../services/postService";
import EditProfileModal from "../components/EditProfileModal";
import PostCard from "../components/PostCard";
import { BASE_URL } from "../services/api";
import { clearAuthSession } from "../utils/authStorage";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUserProfile(userId);
      setProfileData(res.data);
    } catch (error) {
      console.log("Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchSavedPosts = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingSaved(true);
    try {
      const res = await getSavedPosts();
      setSavedPosts(res.data.posts || []);
    } catch (error) {
      console.log("Failed to fetch saved posts");
      setSavedPosts([]);
    } finally {
      if (!silent) setIsLoadingSaved(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
    if (!userId) {
      fetchSavedPosts();
    }
  }, [userId, fetchProfileData, fetchSavedPosts]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await uploadAvatar(formData);
      
      // Update local storage and state
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...res.data.user }));
      
      setProfileData({ ...profileData, user: res.data.user });
      alert("Profile picture updated successfully!");
    } catch (error) {
      alert("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };



  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ 
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh', 
      backgroundColor: 'transparent',
    }}>
      {/* Instagram-Style Profile Header */}
      <div style={{
        padding: '2.5rem 0',
        marginBottom: '3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '900px',
        margin: '0 auto 3.5rem auto'
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: '4rem',
          marginBottom: '2.5rem',
          padding: '0 2rem'
        }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
              backgroundImage: profileData?.user?.avatar ? `url(${BASE_URL}${profileData.user.avatar}?t=${Date.now()})` : 'none',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              border: '4px solid #160A22',
              boxShadow: '0 0 40px rgba(163, 100, 255, 0.1)',
              overflow: 'hidden'
            }}>
              {!profileData?.user?.avatar && (
                <div style={{ fontSize: '5rem', fontWeight: '900', textTransform: 'uppercase' }}>
                  {profileData?.user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

          {/* Identity & Stats Section */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <h1 style={{ 
                margin: 0, 
                color: 'var(--pure-pearl)', 
                fontSize: '2.2rem',
                fontFamily: 'var(--font-header)',
                fontWeight: '900'
              }}>
                {profileData?.user?.name?.toLowerCase() || 'user.name'}
              </h1>
              {!userId && (
                <div style={{ position: 'relative' }}>
                  <span 
                    onClick={() => {
                      console.log("Gear clicked, setting isSettingsOpen to", !isSettingsOpen);
                      setIsSettingsOpen(!isSettingsOpen);
                    }}
                    style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'inline-block', transition: 'transform 0.3s' }}
                    onMouseOver={(e) => e.target.style.transform = 'rotate(90deg)'}
                    onMouseOut={(e) => e.target.style.transform = 'rotate(0deg)'}
                  >
                    ⚙️
                  </span>
                  
                  {isSettingsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '0.8rem',
                    background: 'rgba(25, 25, 30, 0.98)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    minWidth: '160px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    zIndex: 100,
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <button 
                      onClick={() => { setIsSettingsOpen(false); setIsEditModalOpen(true); }}
                      style={{ 
                        background: 'transparent', border: 'none', color: 'white', textAlign: 'left', 
                        padding: '0.8rem 1rem', cursor: 'pointer', borderRadius: '8px',
                        fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      <span>✏️</span> Edit Profile
                    </button>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.2rem 0' }} />
                    <button 
                      onClick={() => {
                        clearAuthSession();
                        navigate("/");
                      }}
                      style={{ 
                        background: 'transparent', border: 'none', color: '#ff4d4d', textAlign: 'left', 
                        padding: '0.8rem 1rem', cursor: 'pointer', borderRadius: '8px',
                        fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(255,77,77,0.15)'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
            </div>

            <div style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '0.9rem', 
              fontWeight: '800', 
              letterSpacing: '0.05em',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {profileData?.user?.tagline || 'NO_TAGLINE_SET'} 🧪
            </div>

            {profileData?.user?.activeNote && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
                borderLeft: '4px solid var(--rich-lilac)',
                display: 'inline-block'
              }}>
                "{profileData.user.activeNote}"
              </div>
            )}

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.1rem', color: 'var(--pure-pearl)' }}>
                <strong style={{ fontWeight: '900' }}>{profileData?.stats?.totalPosts || 0}</strong> <span style={{ opacity: 0.7 }}>posts</span>
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--pure-pearl)' }}>
                <strong style={{ fontWeight: '900' }}>{profileData?.user?.followersCount || 0}</strong> <span style={{ opacity: 0.7 }}>followers</span>
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--pure-pearl)' }}>
                <strong style={{ fontWeight: '900' }}>{profileData?.user?.followingCount || 0}</strong> <span style={{ opacity: 0.7 }}>following</span>
              </div>
            </div>

            <div style={{ 
              color: 'var(--pure-pearl)', 
              fontSize: '1.1rem', 
              fontWeight: '600',
              lineHeight: '1.4'
            }}>
              {profileData?.user?.bio || 'No intellectual bio set yet. ✨'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          width: '100%',
          padding: '0 2rem'
        }}>
          {(!userId || profileData?.isOwner) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem'
            }}>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  padding: '0.8rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                ✏️ Edit profile
              </button>
              <input 
                type="file" 
                id="avatarUpload" 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <button 
                onClick={() => document.getElementById('avatarUpload').click()}
                disabled={isUploading}
                style={{
                  padding: '0.8rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s',
                  opacity: isUploading ? 0.7 : 1
                }}
                onMouseOver={(e) => !isUploading && (e.target.style.background = 'rgba(255,255,255,0.15)')}
                onMouseOut={(e) => !isUploading && (e.target.style.background = 'rgba(255,255,255,0.1)')}
              >
                🖼️ {isUploading ? 'Uploading...' : 'Change Pic'}
              </button>
              <button 
                onClick={() => {
                  clearAuthSession();
                  navigate("/");
                }}
                style={{
                  padding: '0.8rem',
                  background: 'rgba(255,77,77,0.1)',
                  border: '1px solid rgba(255,77,77,0.3)',
                  borderRadius: '12px',
                  color: '#ff4d4d',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,77,77,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,77,77,0.1)';
                }}
              >
                🚪 Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Saved Posts Section - Only show on own profile */}
      {!userId && (
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.3rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📚</span> Saved Posts
          </h3>
          
          {isLoadingSaved ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.7)' }}>
              Loading saved posts...
            </div>
          ) : savedPosts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic'
            }}>
              No saved posts yet. Start saving posts you find interesting! 📌
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedPosts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onInteraction={() => fetchSavedPosts(true)}
                  onOpenComments={() => {}} // Comments handled within PostCard
                  isActive={false}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {isEditModalOpen && (
        <EditProfileModal 
          user={profileData?.user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedUser) => setProfileData({ ...profileData, user: updatedUser })}
        />
      )}
    </div>
  );
}

export default Profile;