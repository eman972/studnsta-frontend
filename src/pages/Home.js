import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [leaderboard, setLeaderboard] = useState([]);
  const [streak, setStreak] = useState(user?.dailyStreak || 0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const meRes = await api.get("/api/auth/me");
        if (!cancelled && meRes.data) {
          setStreak(meRes.data.dailyStreak || 0);
          setUser((prev) => ({ ...prev, ...meRes.data }));
        }

        const lbRes = await api.get("/api/quiz/leaderboard");
        if (!cancelled && lbRes.data?.success) {
          setLeaderboard(lbRes.data.leaderboard.slice(0, 3));
        }
      } catch (error) {
        if (cancelled) return;
        if (error.code === "ERR_NETWORK") {
          console.warn("Backend unreachable. Start it with: cd backend && npm run dev");
        } else if (error.response?.status !== 401) {
          console.error("Error fetching dashboard data", error);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-container" style={{
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh',
      backgroundImage: 'url(/brain_bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundColor: 'rgba(10, 11, 30, 0.7)',
      backgroundBlendMode: 'overlay',
      overflowY: 'auto'
    }}>
      <div className="flex-col gap-6" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
        
        {/* Eye-Catching Banner Intro */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          marginBottom: '2rem',
          animation: 'fadeIn 1s ease-out',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          padding: '4rem 2rem',
          borderRadius: '24px',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)'
        }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/logo_neon_transparent.png" 
              alt="Studnsta Logo" 
              style={{ 
                width: '200px', 
                height: '200px', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 20px rgba(168, 85, 247, 0.4))'
              }} 
            />
          </div>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: '900',
            lineHeight: '1.2',
            letterSpacing: '0.02em',
            margin: 0
          }}>
            <span style={{ color: 'var(--text-primary)' }}>Practice </span>
            <span style={{ color: 'var(--brand-500)' }}>Smarter,</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Progress </span>
            <span style={{ color: 'var(--brand-500)' }}>Faster</span>
          </h1>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.6rem',
            color: 'var(--text-secondary)',
            marginTop: '2rem',
            fontWeight: '300',
            maxWidth: '700px',
            margin: '2rem auto 0 auto',
            lineHeight: '1.8',
            letterSpacing: '0.03em'
          }}>
            Your premier academic collaboration platform. Bridge the gap between knowledge and accessibility, and master your educational curriculum.
          </p>
        </div>

        {/* Dashboard Gamification Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
          
          {/* Streak Card */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => navigate('/quiz-setup')}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: streak > 0 ? 'drop-shadow(0 0 20px rgba(255, 152, 0, 0.5))' : 'grayscale(1)' }}>
              🔥
            </div>
            <h3 style={{ color: 'var(--pure-pearl)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              {streak} Day Streak
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {streak > 0 
                ? "You're on fire! Keep it up by taking a practice quiz today." 
                : "Start a learning streak by taking a practice quiz today!"}
            </p>
          </div>

          {/* Leaderboard Preview Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--pure-pearl)', fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#ffd700' }}>🏆</span> Top Students
              </h3>
              <button 
                onClick={() => navigate('/leaderboard')}
                style={{ background: 'transparent', border: 'none', color: 'var(--brand-400)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                View All
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaderboard.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>No rankings yet!</div>
              ) : (
                leaderboard.map((student, index) => (
                  <div key={student._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem 1rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', width: '25px', textAlign: 'center' }}>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div style={{ flex: 1, fontWeight: 'bold', color: 'var(--pure-pearl)' }}>{student.name}</div>
                    <div style={{ color: 'var(--brand-400)', fontWeight: '900' }}>{student.averageScore}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>

        {/* Why Choose Studnsta */}
        <div className="glass-card" style={{ padding: '3rem', marginTop: '2rem' }}>
          <h2 className="text-gradient-lavender" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            Why Choose Studnsta?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Feature 1 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Community Driven</h3>
              <p style={{ color: 'var(--text-muted)' }}>Join a vibrant community of students and educators. Discuss, share, and solve complex problems together.</p>
            </div>
            {/* Feature 2 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>AI Powered Learning</h3>
              <p style={{ color: 'var(--text-muted)' }}>Get stuck? Our AI Tutor is available 24/7 to provide personalized explanations and guide your learning journey.</p>
            </div>
            {/* Feature 3 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Track Your Progress</h3>
              <p style={{ color: 'var(--text-muted)' }}>Visualize your mastery with advanced analytics, test history, and intelligent performance tracking.</p>
            </div>
            {/* Feature 4 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Comprehensive Resources</h3>
              <p style={{ color: 'var(--text-muted)' }}>Access a vast, organized library of peer-reviewed study notes and high-quality PDF materials.</p>
            </div>
            {/* Feature 5 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Live Interaction</h3>
              <p style={{ color: 'var(--text-muted)' }}>Participate in live, interactive quiz sessions hosted by verified teachers to test your knowledge.</p>
            </div>
            {/* Feature 6 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Gamified Experience</h3>
              <p style={{ color: 'var(--text-muted)' }}>Turn learning into an engaging journey with interactive challenges and immediate feedback.</p>
            </div>
          </div>
        </div>

        {/* Advantages & Features */}
        <div className="glass-card" style={{ padding: '3rem', marginTop: '1rem' }}>
          <h2 className="text-gradient-lavender" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            Unfair Advantages
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>✨</span> 
              Access to hundreds of organized study notes and PDFs.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>⚡</span> 
              Live multiplayer quizzes managed by verified teachers.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>🎯</span> 
              Instant feedback and detailed explanations for every practice question.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>🛡️</span> 
              Safe, moderated environment strictly focused on academics.
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/quiz-setup')}
            className="glow-button"
            style={{
              padding: '1.5rem 4rem',
              fontSize: '1.5rem',
              borderRadius: '50px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              background: 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
              boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)',
              transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            START LEARNING
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;