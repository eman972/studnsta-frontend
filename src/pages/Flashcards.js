import { useEffect, useState } from "react";
import { dueFlashcards, reviewFlashcard, createFlashcard, listFlashcards } from "../services/platformService";

const QUALITY = [
  { q: 0, label: "Again" },
  { q: 2, label: "Hard" },
  { q: 3, label: "Good" },
  { q: 5, label: "Easy" },
];

function Flashcards() {
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ front: "", back: "", subject: "" });
  const [error, setError] = useState("");

  const load = async () => {
    setIsLoading(true);
    try {
      const [dueRes, allRes] = await Promise.all([dueFlashcards(), listFlashcards()]);
      setCards(dueRes.data.cards || []);
      setAllCards(allRes.data.cards || []);
      setIndex(0);
      setFlipped(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cards");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const current = cards[index];

  const handleReview = async (quality) => {
    if (!current) return;
    try {
      await reviewFlashcard(current._id, quality);
      let next;
      if (quality < 3) {
        // Move to the back of the deck to review again this session
        next = [...cards.filter((_, i) => i !== index), current];
      } else {
        // Remove from current session
        next = cards.filter((_, i) => i !== index);
      }
      setCards(next);
      setIndex(0);
      setFlipped(false);
    } catch (err) {
      setError(err.response?.data?.message || "Review failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createFlashcard(form);
      setForm({ front: "", back: "", subject: "" });
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", margin: 0 }}>Flashcards</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>
            {cards.length} card{cards.length === 1 ? "" : "s"} due
          </p>
        </div>
        <button type="button" className="glow-button" onClick={() => setShowCreate(!showCreate)} aria-label="Create flashcard">
          {showCreate ? "Cancel" : "New Card"}
        </button>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input className="input-field" placeholder="Front" value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} required aria-label="Card front" />
          <input className="input-field" placeholder="Back" value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} required aria-label="Card back" />
          <input className="input-field" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} aria-label="Subject" />
          <button type="submit" className="glow-button">Add Card</button>
        </form>
      )}

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
      ) : !current ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          No cards due — nice work!
        </div>
      ) : (
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <button
            type="button"
            className="glass-card"
            onClick={() => setFlipped(!flipped)}
            aria-label={flipped ? "Show front" : "Show back"}
            style={{
              width: "100%",
              minHeight: 220,
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--pure-pearl)",
              fontSize: "1.35rem",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {flipped ? current.back : current.front}
          </button>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.75rem 0 1.25rem" }}>
            Tap card to flip · {current.subject || "General"}
          </p>
          {flipped && (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              {QUALITY.map(({ q, label }) => (
                <button
                  key={q}
                  type="button"
                  className="glow-button"
                  onClick={() => handleReview(q)}
                  aria-label={`Rate ${label}`}
                  style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Library Section */}
      <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--glass-border)" }}>
        <h2 style={{ color: "var(--pure-pearl)", fontWeight: 800, fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          All Saved Cards ({allCards.length})
        </h2>
        {allCards.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>You haven't created any cards yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {allCards.map((c) => (
              <div key={c._id} className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--rich-lilac)", fontWeight: 700, textTransform: "uppercase" }}>
                  {c.subject || "General"}
                </div>
                <div style={{ color: "var(--pure-pearl)", fontWeight: 600, fontSize: "1.1rem" }}>
                  Q: {c.front}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  A: {c.back}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>
                  Next review: {new Date(c.nextReviewAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Flashcards;
