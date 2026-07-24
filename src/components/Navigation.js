import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api, { BASE_URL } from "../services/api";
import { clearAuthSession, getRefreshToken } from "../utils/authStorage";
import { logout as logoutApi } from "../services/authService";
import NotificationBell from "./NotificationBell";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const userRole = (localStorage.getItem("userRole") || "").toLowerCase();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [liveStreak, setLiveStreak] = useState(user?.dailyStreak || 0);

  const [isLightMode, setIsLightMode] = useState(() => {
    return document.body.classList.contains("light-mode");
  });

  useEffect(() => {
    let cancelled = false;

    const fetchMe = async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (cancelled || !res.data) return;
        setLiveStreak(res.data.dailyStreak || 0);
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...res.data }));
      } catch (error) {
        if (cancelled) return;
        if (error.code === "ERR_NETWORK") {
          console.warn("Backend unreachable. Start it with: cd backend && npm run dev");
        } else if (error.response?.status !== 401) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    fetchMe();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("light-mode");
      } else {
        document.body.classList.remove("light-mode");
      }
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      if (getRefreshToken()) await logoutApi();
    } catch (_) {
      /* ignore */
    }
    clearAuthSession();
    navigate("/");
  };

  const baseMenuItems = [
    { name: "Dashboard", path: "/home", icon: "Dashboard" },
    { name: "Connect", path: "/connect", icon: "Connect" },
    { name: "Study Notes", path: "/notes", icon: "Notes" },
    { name: "Classes", path: "/classes", icon: "Classes" },
    { name: "Messages", path: "/messages", icon: "Messages" },
    { name: "Notifications", path: "/notifications", icon: "Bell" },
    { name: "Calendar", path: "/calendar", icon: "Calendar" },
    { name: "Flashcards", path: "/flashcards", icon: "Cards" },
    { name: "People", path: "/people", icon: "People" },
    { name: "Search", path: "/search", icon: "Search" },
    { name: "Assignments", path: "/assignments", icon: "Assignments" },
    { name: "Mastery", path: "/mastery", icon: "Mastery" },
    { name: "Study Groups", path: "/study-groups", icon: "Groups" },
    { name: "Clubs", path: "/clubs", icon: "Clubs" },
    { name: "My Progress", path: "/progress", icon: "Analytics" },
    { name: "Practice Quiz", path: "/quiz-setup", icon: "Quiz" },
    { name: "Leaderboard", path: "/leaderboard", icon: "Trophy" },
    { name: "AI Tutor", path: "/ai-tutor", icon: "AI" },
    { name: "Create Quiz", path: "/live-quiz-setup", icon: "Create" },
    { name: "Teacher Quizzes", path: "/teacher-quizzes", icon: "Teacher" },

    { name: "Profile", path: "/profile", icon: "Person" },
    { name: "Settings", path: "/settings", icon: "Settings" },
    { name: "Guide", path: "/privacy", icon: "Help" },
    { name: "Admin Panel", path: "/admin", icon: "Admin" },
  ];

  const menuItems = baseMenuItems.filter((item) => {
    if (userRole === "student" && item.path === "/live-quiz-setup") return false;
    if (item.path === "/teacher-quizzes" && userRole !== "teacher") return false;
    if (item.path === "/admin" && userRole !== "admin") return false;
    return true;
  });

  const isActive = (path) => {
    if (path === "/profile") return location.pathname.startsWith("/profile");
    if (path === "/classes") return location.pathname.startsWith("/classes");
    if (path === "/messages") return location.pathname.startsWith("/messages");
    return location.pathname === path;
  };

  const getIcon = (iconName) => {
    const iconEmojis = {
      Dashboard: "🏠",
      Connect: "💬",
      Notes: "📚",
      Classes: "🎓",
      Messages: "✉️",
      Bell: "🔔",
      Calendar: "📅",
      Cards: "🃏",
      People: "👥",
      Search: "🔍",
      Assignments: "📋",
      Mastery: "🗺️",
      Groups: "🧑‍🤝‍🧑",
      Clubs: "🏛️",
      Analytics: "📈",
      Quiz: "📝",
      Trophy: "🏆",
      AI: "🤖",
      Create: "➕",
      Teacher: "👨‍🏫",

      Person: "👤",
      Settings: "⚙️",
      Help: "❓",
      Admin: "🛡️",
      Logout: "🔌",
    };
    return iconEmojis[iconName] || "📍";
  };

  return (
    <>
      <aside className="sidebar no-scrollbar">
        <div
          onClick={() => setIsAboutOpen(true)}
          title="About Studnsta"
          role="button"
          tabIndex={0}
          aria-label="About Studnsta"
          onKeyDown={(e) => e.key === "Enter" && setIsAboutOpen(true)}
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
              width: "65px",
              height: "65px",
              marginBottom: "var(--space-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/logo_neon_transparent.png"
              alt="Studnsta Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
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

        <nav style={{ flex: 1 }} aria-label="Main navigation">
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
                    onClick={() => {
                      if (userRole === "guest" && item.path !== "/home") {
                        alert("Please register to access all modules and features!");
                      } else {
                        navigate(item.path);
                      }
                    }}
                    className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                    aria-label={item.name}
                    aria-current={isActive(item.path) ? "page" : undefined}
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
                backgroundImage: user.avatar ? `url(${BASE_URL}${user.avatar})` : "none",
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
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
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

            <NotificationBell />

            <div
              title={`${liveStreak} Day Streak`}
              aria-label={`${liveStreak} day streak`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.2rem",
                background: "rgba(255, 140, 0, 0.15)",
                padding: "0.4rem 0.6rem",
                borderRadius: "20px",
                color: "#ff9800",
                fontWeight: "800",
                fontSize: "0.9rem",
                border: "1px solid rgba(255, 152, 0, 0.3)",
                boxShadow: liveStreak > 0 ? "0 0 10px rgba(255, 152, 0, 0.2)" : "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 152, 0, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  liveStreak > 0 ? "0 0 10px rgba(255, 152, 0, 0.2)" : "none";
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>🔥</span>
              <span>{liveStreak}</span>
            </div>

            <button
              onClick={toggleTheme}
              aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "0.5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {isLightMode ? "🌙" : "☀️"}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="menu-item"
            aria-label="Log out"
            style={{
              marginTop: "1rem",
              backgroundColor: "rgba(255, 100, 100, 0.05)",
              borderColor: "rgba(255, 100, 100, 0.2)",
            }}
          >
            <span className="menu-icon">🔌</span>
            <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: "600", letterSpacing: "0.025em" }}>
              Logout
            </span>
          </button>
        </div>
      </aside>

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
            className="no-scrollbar"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="About Studnsta"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(25px)",
              padding: "3.5rem",
              borderRadius: "40px",
              maxWidth: "650px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
              position: "relative",
              textAlign: "center",
              border: "1px solid rgba(163, 100, 255, 0.1)",
              animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <button
              onClick={() => setIsAboutOpen(false)}
              aria-label="Close about dialog"
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
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
              <img
                src="/logo_neon_transparent.png"
                alt="Studnsta"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 20px rgba(168, 85, 247, 0.4))",
                }}
              />
            </div>
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
                color: "rgba(255, 255, 255, 0.85)",
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
