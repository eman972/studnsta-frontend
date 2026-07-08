import { useState } from "react";
import { getNote, deleteNote } from "../services/noteService";

function NoteCard({ note, onInteraction, isTeacher }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleViewPdf = async () => {
    setIsLoading(true);
    try {
      const res = await getNote(note._id);
      window.open(`http://localhost:5000${res.data.pdfUrl}`, '_blank');
      onInteraction(); // Refresh to update download count
    } catch (error) {
      alert("Failed to load PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${note.pdfUrl}`;
    link.download = `${note.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onInteraction(); // Refresh to update download count
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setIsLoading(true);
      try {
        await deleteNote(note._id);
        onInteraction();
      } catch (error) {
        alert("Failed to delete note");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getNoteTypeColor = (type) => {
    switch (type) {
      case "Past Note": return "#e3f2fd";

      case "Key Book": return "#e8f5e8";
      case "Notes": return "#fff3e0";
      default: return "#f5f5f5";
    }
  };

  const getNoteTypeTextColor = (type) => {
    switch (type) {
      case "Past Note": return "#1976d2";

      case "Key Book": return "#388e3c";
      case "Notes": return "#f57c00";
      default: return "#666";
    }
  };

  return (
    <>
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem',
        background: 'rgba(250, 250, 255, 0.95)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0', color: '#333', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📄 {note.title}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <div>
            Uploaded by <strong>{note.uploadedBy.name}</strong> ({note.uploadedBy.role})
          </div>
          <div>
            📥 {note.downloads} downloads
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={handleViewPdf}
            disabled={isLoading}
            className="glow-button"
            style={{
              flex: 1,
              fontSize: '0.95rem',
              letterSpacing: '0.05em'
            }}
          >
            {isLoading ? 'Unlocking...' : '👁️ View Note'}
          </button>
          
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            📥 Download
          </button>
          
          {isTeacher && note.uploadedBy._id === localStorage.getItem("userId") && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isLoading ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '0.9rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>


    </>
  );
}

export default NoteCard;
