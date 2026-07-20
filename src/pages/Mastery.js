import { useEffect, useState } from "react";
import { getMastery, getStudyPlan } from "../services/platformService";

function Mastery() {
  const [mastery, setMastery] = useState([]);
  const [plan, setPlan] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [mRes, pRes] = await Promise.all([getMastery(), getStudyPlan()]);
        setMastery(mRes.data.mastery || []);
        setPlan(pRes.data.plan || []);
        setWeakTopics(pRes.data.weakTopics || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load mastery");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const levelColor = (avg) => {
    if (avg >= 80) return "#22c55e";
    if (avg >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="page-container">
      <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "0.4rem" }}>Mastery Map</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>See strengths and a weekly study plan</p>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
      ) : (
        <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h2 style={{ color: "var(--pure-pearl)", fontSize: "1.2rem", marginBottom: "1rem" }}>Topics</h2>
            {mastery.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>Take quizzes to build your mastery map</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {mastery.map((m, i) => (
                  <div key={i} style={{ padding: "0.85rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ color: "var(--pure-pearl)", fontWeight: 600 }}>
                        {m.subject || "General"} · {m.topic || "General"}
                      </span>
                      <span style={{ color: levelColor(m.average), fontWeight: 800 }}>{m.average}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, m.average)}%`, borderRadius: 99, background: levelColor(m.average) }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h2 style={{ color: "var(--pure-pearl)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Weekly Study Plan</h2>
            {weakTopics.length > 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                Focus: {weakTopics.join(", ")}
              </p>
            )}
            {plan.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No plan yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {plan.map((day) => (
                  <div key={day.day} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                    <span style={{ color: "var(--rich-lilac)", fontWeight: 700, width: 48 }}>{day.day}</span>
                    <span style={{ color: "var(--pure-pearl)", flex: 1 }}>{day.focus}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{day.minutes}m</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Mastery;
