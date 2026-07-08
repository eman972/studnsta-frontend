import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const userRole = localStorage.getItem("userRole");
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const baseMenuItems = [
    { name: "Dashboard", path: "/home", icon: "Dashboard" },
    { name: "Study Notes", path: "/notes", icon: "Notes" },
    { name: "My Progress", path: "/progress", icon: "Analytics" },
    { name: "Practice Quiz", path: "/quiz-setup", icon: "Quiz" },
    { name: "AI Tutor", path: "/ai-tutor", icon: "AI" },
    { name: "Create Quiz", path: "/live-quiz-setup", icon: "Create" },
    { name: "Profile", path: "/profile", icon: "Person" },
    { name: "Help & Safety", path: "/privacy", icon: "Help" },
  ];

  const menuItems = baseMenuItems.filter(item => 
    !(userRole?.toLowerCase() === "student" && item.path === "/live-quiz-setup")
  );

  const isActive = (path) => {
    if (path === "/profile") return location.pathname.startsWith("/profile");
    return location.pathname === path;
  };

  const getIcon = (iconName) => {
    const iconEmojis = {
      Dashboard: "🏠",
      Notes: "📚",
      Analytics: "📈",
      Quiz: "📝",
      AI: "🤖",
      Create: "➕",
      Person: "👤",
      Help: "🛡️",
    };
    return iconEmojis[iconName] || "📍";
  };

  return (
    <>
      <aside className="sidebar">
        {/* Logo */}
        <div
          onClick={() => setIsAboutOpen(true)}
          title="About Studnsta"
          style={{
            marginBottom: "var(--space-8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "var(--radius-2xl)",
              background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "white",
              marginBottom: "var(--space-3)",
              boxShadow: "var(--shadow-lg), var(--shadow-glow)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>S</span>
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                animation: "shimmer 3s infinite",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.025em",
            }}
          >
            Studnsta
          </div>
          <div
            style={{
              height: "3px",
              width: "40px",
              background: "var(--rich-lilac)",
              borderRadius: "10px",
              marginTop: "0.5rem",
              opacity: 0.6,
            }}
          />
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: "var(--space-4)" }}>
            <h3
              style={{
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "var(--space-3)",
              }}
            >
              Main Menu
            </h3>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menuItems.map((item) => {
              return (
                <li key={item.path} style={{ marginBottom: "var(--space-2)" }}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                  >
                    <span className="menu-icon">{getIcon(item.icon)}</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        letterSpacing: "0.025em",
                      }}
                    >
                      {item.name}
                    </span>
                    {isActive(item.path) && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor: "white",
                          boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="user-profile-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: user.avatar ? "transparent" : "var(--rich-lavender)",
                backgroundImage: user.avatar ? `url(http://localhost:5000${user.avatar})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 4px 10px rgba(142, 68, 173, 0.3)",
                overflow: "hidden",
              }}
            >
              {!user.avatar && (user.name?.charAt(0).toUpperCase() || "U")}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--pure-pearl)",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name || "User"}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--rich-lilac)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "0.2rem",
                }}
              >
                {user.role || "Guest"}
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-danger-outline">
            Sign Out
          </button>
        </div>
      </aside>

      {/* About Overlay */}
      {isAboutOpen && (
        <div
          onClick={() => setIsAboutOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(26, 11, 46, 0.4)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--white)",
              padding: "3.5rem",
              borderRadius: "40px",
              maxWidth: "650px",
              width: "90%",
              boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
              position: "relative",
              textAlign: "center",
              border: "1px solid rgba(163, 100, 255, 0.1)",
              animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <button
              onClick={() => setIsAboutOpen(false)}
              style={{
                position: "absolute",
                top: "2rem",
                right: "2rem",
                background: "var(--accent-soft)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "var(--rich-lavender)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rich-lilac)";
                e.currentTarget.style.color = "var(--white)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-soft)";
                e.currentTarget.style.color = "var(--rich-lavender)";
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎓</div>

            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "950",
                marginBottom: "2rem",
                background: "linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.1em",
              }}
            >
              ABOUT STUDNSTA
            </h2>

            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.8",
                color: "var(--text-dark)",
                fontWeight: "500",
                marginBottom: "2.5rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Studnsta is a premier academic collaboration platform designed to empower students by
              bridging the gap between knowledge and accessibility. By providing a streamlined hub for
              high-quality study notes and PDF resources and fostering a vibrant community for
              discussion, we transform the way students discover, share, and master their educational
              curriculum. Experience a world where academic excellence meets modern connectivity.
            </p>

            <div
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                borderRadius: "20px",
                background: "linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))",
                color: "var(--white)",
                fontWeight: "700",
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(163, 100, 255, 0.3)",
              }}
              onClick={() => setIsAboutOpen(false)}
            >
              Start Learning
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Navigation;
