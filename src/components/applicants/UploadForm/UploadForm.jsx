import { useState, useRef } from 'react';
import { uploadApplicants } from '../../../services/api';
import { Paperclip } from 'lucide-react';
import './UploadForm.css';

function UploadForm({ jobId, onAdded, onCancel }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    if (picked) setFile(picked);
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('jobId', jobId);
      const result = await uploadApplicants(form);
      onAdded(result.applicants);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h3 className="upload-form-title">Upload CV / Spreadsheet</h3>

      {error && <p className="upload-form-error">{error}</p>}

      <div
        className={`upload-form-dropzone ${file ? 'upload-form-dropzone--has-file' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.csv,.xlsx,.xls"
          className="upload-form-file-input"
          onChange={handleFileChange}
        />
        {file ? (
          <div className="upload-form-file-info">
            <Paperclip size={18} />
            <span className="upload-form-file-name">{file.name}</span>
            <button
              type="button"
              className="upload-form-file-remove"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-form-placeholder">
            <Paperclip size={22} className="upload-form-placeholder-icon" />
            <p className="upload-form-placeholder-text">Click to choose a file</p>
            <p className="upload-form-placeholder-hint">PDF, DOCX, CSV, XLSX — max 7MB</p>
          </div>
        )}
      </div>

      <div className="upload-form-actions">
        <button type="button" className="upload-form-cancel-btn" onClick={onCancel} disabled={uploading}>Cancel</button>
        <button type="submit" className="upload-form-submit-btn" disabled={!file || uploading}>
          {uploading ? 'Uploading…' : 'Upload & Extract'}
        </button>
      </div>
    </form>
  );
}

export default UploadForm;
