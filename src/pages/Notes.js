import { useEffect, useState } from "react";
import { getNotes } from "../services/noteService";
import NoteCard from "../components/NoteCard";
import UploadNoteModal from "../components/UploadNoteModal";
import SkeletonLoader from "../components/SkeletonLoader";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "guest");
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await getNotes({});
      setNotes(res.data);
    } catch (error) {
      console.log("Failed to fetch notes");
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteraction = () => {
    fetchNotes();
  };

  return (
    <div className="page-container" style={{ 
      margin: '-2rem',
      padding: '3rem',
      minHeight: '100vh', 
      backgroundColor: 'transparent',
    }}>
      {/* Header */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.2rem', 
              fontWeight: '900'
            }}>
              📚 Course Notes & PDFs
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-secondary)', opacity: 0.9, fontSize: '1rem', fontWeight: '500' }}>
              Download PDF books, course notes, and study materials
            </p>
          </div>
          {userRole?.toLowerCase() !== "student" && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="glow-button"
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Upload PDF
            </button>
          )}
        </div>
        
        {/* Search Bar */}
        <div style={{ marginTop: '1.5rem', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search notes, books, subjects, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--pure-pearl)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-500)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <SkeletonLoader width="60px" height="60px" borderRadius="12px" />
              <div style={{ flex: 1 }}>
                <SkeletonLoader height="2rem" width="250px" style={{ marginBottom: '1rem' }} />
                <SkeletonLoader height="1rem" width="150px" />
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <SkeletonLoader width="60px" height="60px" borderRadius="12px" />
              <div style={{ flex: 1 }}>
                <SkeletonLoader height="2rem" width="200px" style={{ marginBottom: '1rem' }} />
                <SkeletonLoader height="1rem" width="120px" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {!isLoading && notes.filter(note => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          note.title?.toLowerCase().includes(query) ||
          note.description?.toLowerCase().includes(query) ||
          note.subject?.toLowerCase().includes(query) ||
          note.topic?.toLowerCase().includes(query)
        );
      }).map((note) => (
        <NoteCard 
          key={note._id} 
          note={note} 
          onInteraction={handleInteraction}
          isTeacher={userRole === "teacher"}
        />
      ))}

      {/* Empty State */}
      {!isLoading && notes.length > 0 && notes.filter(note => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          note.title?.toLowerCase().includes(query) ||
          note.description?.toLowerCase().includes(query) ||
          note.subject?.toLowerCase().includes(query) ||
          note.topic?.toLowerCase().includes(query)
        );
      }).length === 0 && (
        <div className="glass-card" style={{
          padding: '5rem 3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>No Matches Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            We couldn't find any notes matching "{searchQuery}".
          </p>
        </div>
      )}

      {/* Real Empty State */}
      {!isLoading && notes.length === 0 && (
        <div className="glass-card" style={{
          padding: '5rem 3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>No PDFs Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            There are currently no notes or PDF books available. Check back later!
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadNoteModal
          onClose={() => setShowUploadModal(false)}
          onNoteUploaded={fetchNotes}
        />
      )}
    </div>
  );
}

export default Notes;