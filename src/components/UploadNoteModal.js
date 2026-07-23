import { useState } from "react";
import { uploadNote } from "../services/noteService";

function UploadNoteModal({ onClose, onNoteUploaded }) {
  const [formData, setFormData] = useState({
    title: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert("Please upload a PDF");
      return;
    }

    setIsLoading(true);
    
    try {
      const noteFormData = new FormData();
      noteFormData.append("title", formData.title || pdfFile.name.replace(/\.[^/.]+$/, ""));
      noteFormData.append("subject", "General");
      noteFormData.append("noteType", "Notes");
      noteFormData.append("pdf", pdfFile);

      await uploadNote(noteFormData);
      onNoteUploaded();
      onClose();
    } catch (error) {
      console.error(error);
      alert(`Failed to upload note: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(163, 100, 255, 0.2)',
        padding: '2rem',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--white)' }}>Upload Note</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Leave blank to use filename" style={{ width: '100%', padding: '0.5rem', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--white)', borderRadius: '5px', fontSize: '0.9rem' }} />
          </div>



          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              PDF File *
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: 'var(--white)',
                borderRadius: '5px',
                fontSize: '0.9rem'
              }}
            />
            {pdfFile && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--accent-soft)',
                color: 'var(--rich-lavender)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: isLoading ? '#ccc' : 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Uploading...' : 'Upload Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadNoteModal;
