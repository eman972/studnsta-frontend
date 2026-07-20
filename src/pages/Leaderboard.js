import { useState, useEffect } from "react";
import api, { BASE_URL } from "../services/api";
import SkeletonLoader from "../components/SkeletonLoader";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/api/quiz/leaderboard");
        if (res.data.success) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getMedalColor = (index) => {
    if (index === 0) return "linear-gradient(135deg, #ffd700, #ffb300)"; // Gold
    if (index === 1) return "linear-gradient(135deg, #e0e0e0, #9e9e9e)"; // Silver
    if (index === 2) return "linear-gradient(135deg, #ffb085, #d87040)"; // Bronze
    return "transparent";
  };

  const getRankStyle = (index) => {
    if (index < 3) {
      return {
        background: getMedalColor(index),
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: "900",
        fontSize: "1.5rem",
      };
    }
    return {
      color: "var(--text-muted)",
      fontWeight: "700",
      fontSize: "1.2rem",
    };
  };

  return (
    <div className="page-container" style={{ margin: "-2rem", padding: "3rem", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ 
          color: "var(--pure-pearl)",
          fontSize: "2.5rem",
          fontWeight: "900",
          marginBottom: "0.5rem",
          background: "linear-gradient(135deg, #ffd700, #ff8c00)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem"
        }}>
          🏆 Global Leaderboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Top students across the entire platform
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SkeletonLoader height="80px" count={5} borderRadius="16px" />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {leaderboard.length === 0 ? (
              <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌱</div>
                <h3 style={{ color: "var(--pure-pearl)", marginBottom: "0.5rem" }}>It's quiet in here</h3>
                <p style={{ color: "var(--text-muted)" }}>Be the first to take a practice quiz and claim the #1 spot!</p>
              </div>
            ) : (
              leaderboard.map((student, index) => {
                const isCurrentUser = student._id === currentUserId;
                
                return (
                  <div
                    key={student._id}
                    className="glass-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "1.5rem 2rem",
                      gap: "1.5rem",
                      borderRadius: "16px",
                      background: isCurrentUser 
                        ? "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(126, 34, 206, 0.05))" 
                        : "var(--glass-bg)",
                      border: isCurrentUser ? "1px solid rgba(168, 85, 247, 0.4)" : "1px solid var(--glass-border)",
                      transform: index < 3 ? "scale(1.02)" : "scale(1)",
                      zIndex: index < 3 ? 10 - index : 1,
                      boxShadow: index === 0 ? "0 10px 30px rgba(255, 215, 0, 0.15)" : "none",
                      transition: "transform 0.2s"
                    }}
                  >
                    {/* Rank */}
                    <div style={{ width: "40px", textAlign: "center" }}>
                      {index < 3 ? (
                        <div style={{ fontSize: "2rem", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </div>
                      ) : (
                        <span style={getRankStyle(index)}>#{index + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "14px",
                        backgroundColor: student.avatar ? "transparent" : "var(--rich-lavender)",
                        backgroundImage: student.avatar ? `url(${BASE_URL}${student.avatar})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        boxShadow: index === 0 ? "0 0 20px rgba(255, 215, 0, 0.4)" : "0 4px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      {!student.avatar && (student.name?.charAt(0).toUpperCase() || "S")}
                    </div>

                    {/* Name */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{
                          fontWeight: "800",
                          fontSize: "1.2rem",
                          color: "var(--text-primary)",
                        }}>
                          {student.name}
                        </span>
                        {isCurrentUser && (
                          <span style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "10px",
                            background: "var(--brand-500)",
                            color: "white",
                            fontWeight: "bold"
                          }}>YOU</span>
                        )}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                        {student.totalQuizzes} {student.totalQuizzes === 1 ? "quiz" : "quizzes"} completed
                      </div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: "1.5rem",
                        fontWeight: "900",
                        background: index < 3 ? getMedalColor(index) : "var(--pure-pearl)",
                        WebkitBackgroundClip: index < 3 ? "text" : "none",
                        WebkitTextFillColor: index < 3 ? "transparent" : "initial",
                        color: index >= 3 ? "var(--pure-pearl)" : "transparent"
                      }}>
                        {student.averageScore}%
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>
                        Avg Score
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
