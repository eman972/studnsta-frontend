import { useState } from "react";
import { uploadNote } from "../services/noteService";

function UploadNoteModal({ onClose, onNoteUploaded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "Math",
    chapter: "",
    year: "2024",
    noteType: "Past Note",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const subjects = ["Math", "Physics", "Chemistry", "Biology", "Computer", "English", "Urdu", "Pak Studies", "Islamiat"];
  const noteTypes = ["Past Note", "Key Book", "Notes"];
  const years = Array.from({ length: 10 }, (_, i) => (2024 - i).toString());
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert("Please upload a PDF");
      return;
    }

    setIsLoading(true);
    
    try {
      const noteFormData = new FormData();
      noteFormData.append("title", pdfFile.name.replace(/\.[^/.]+$/, "")); // use filename without extension
      noteFormData.append("description", "Uploaded Document");
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
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Upload Note</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontSize: '0.9rem' }}>
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
                border: '1px solid #ddd',
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
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
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
                backgroundColor: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
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
