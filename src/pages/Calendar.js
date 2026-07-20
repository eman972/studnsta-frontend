import { useEffect, useState } from "react";
import { listEvents, createEvent, downloadIcs } from "../services/platformService";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", start: "", end: "" });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await listEvents();
      setEvents(res.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        start: form.start ? new Date(form.start).toISOString() : undefined,
        end: form.end ? new Date(form.end).toISOString() : undefined,
      });
      setForm({ title: "", description: "", start: "", end: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  const handleExport = async () => {
    try {
      await downloadIcs();
    } catch (err) {
      setError("Export failed");
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", margin: 0 }}>Calendar</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Upcoming events and deadlines</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className="glow-button" onClick={handleExport} aria-label="Export calendar as ICS">Export ICS</button>
          <button type="button" className="glow-button" onClick={() => setShowForm(!showForm)} aria-label="Add event">
            {showForm ? "Cancel" : "Add Event"}
          </button>
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required aria-label="Event title" />
          <input className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} aria-label="Event description" />
          <input className="input-field" type="datetime-local" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required aria-label="Start time" />
          <input className="input-field" type="datetime-local" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} aria-label="End time" />
          <button type="submit" className="glow-button">Save Event</button>
        </form>
      )}

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>No events yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {events.map((ev) => (
            <div key={ev._id} className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ color: "var(--pure-pearl)", fontWeight: 700, fontSize: "1.1rem" }}>{ev.title}</div>
              {ev.description && <p style={{ color: "var(--text-muted)", marginTop: "0.35rem" }}>{ev.description}</p>}
              <p style={{ color: "var(--rich-lilac)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                {ev.start ? new Date(ev.start).toLocaleString() : ""}
                {ev.end ? ` → ${new Date(ev.end).toLocaleString()}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendar;
