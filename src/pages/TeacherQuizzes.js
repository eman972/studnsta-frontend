import { useEffect, useState } from "react";
import { getTeacherLiveQuizzes, getLiveQuizResults } from "../services/liveQuizService";

function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [quizResultsData, setQuizResultsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getTeacherLiveQuizzes({ limit: 50 });
        if (res?.success) setQuizzes(res.quizzes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleToggleQuiz = async (quizId) => {
    if (expandedQuizId === quizId) {
      setExpandedQuizId(null);
      return;
    }
    setExpandedQuizId(quizId);
    if (!quizResultsData[quizId]) {
      try {
        const res = await getLiveQuizResults(quizId, { limit: 100 });
        if (res?.success) {
          setQuizResultsData((prev) => ({
            ...prev,
            [quizId]: { results: res.results, stats: res.statistics },
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor((seconds || 0) / 60);
    const secs = (seconds || 0) % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="page-container">
      <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "0.5rem" }}>
        Teacher Quizzes
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Track performance across your live quizzes
      </p>

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
          Loading...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No live quizzes yet. Create one from Create Quiz.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {quizzes.map((quiz) => {
            const isExpanded = expandedQuizId === quiz.id;
            const data = quizResultsData[quiz.id];
            return (
              <div key={quiz.id} className="glass-card" style={{ overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => handleToggleQuiz(quiz.id)}
                  aria-expanded={isExpanded}
                  aria-label={`Toggle results for ${quiz.title}`}
                  style={{
                    width: "100%",
                    padding: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <div>
                    <div style={{ color: "var(--pure-pearl)", fontSize: "1.15rem", fontWeight: 600 }}>
                      {quiz.title}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      {quiz.subject} · {quiz.topic} · {quiz.participants || 0} participants
                    </div>
                  </div>
                  <span style={{ color: "var(--pure-pearl)", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    ▼
                  </span>
                </button>
                {isExpanded && (
                  <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid var(--glass-border)" }}>
                    {!data ? (
                      <p style={{ color: "var(--text-muted)", paddingTop: "1rem" }}>Loading results...</p>
                    ) : (data.results || []).length === 0 ? (
                      <p style={{ color: "var(--text-muted)", paddingTop: "1rem" }}>No submissions yet.</p>
                    ) : (
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {data.stats && (
                          <p style={{ color: "var(--rich-lilac)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                            Avg {Math.round(data.stats.averageScore || 0)}% · {data.stats.totalParticipants || data.results.length} students
                          </p>
                        )}
                        {data.results.map((r) => (
                          <div
                            key={r._id || r.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0.75rem 1rem",
                              background: "rgba(255,255,255,0.03)",
                              borderRadius: 10,
                            }}
                          >
                            <span style={{ color: "var(--pure-pearl)" }}>{r.studentName || r.student?.name || "Student"}</span>
                            <span style={{ color: "var(--text-muted)" }}>
                              {r.score}% · {formatTime(r.timeTaken)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeacherQuizzes;
