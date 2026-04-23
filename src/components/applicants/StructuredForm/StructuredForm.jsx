import { useState } from 'react';
import { createApplicant } from '../../../services/api';
import './StructuredForm.css';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  skills: '',
  experienceYears: '',
  education: '',
  summary: '',
};

function StructuredForm({ jobId, onAdded, onCancel }) {
  const [fields, setFields] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...fields,
        jobId,
        skills: fields.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experienceYears: Number(fields.experienceYears) || 0,
      };
      const applicant = await createApplicant(payload);
      onAdded(applicant);
      setFields(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="structured-form" onSubmit={handleSubmit}>
      <h3 className="structured-form-title">Add Applicant Manually</h3>

      {error && <p className="structured-form-error">{error}</p>}

      <div className="structured-form-row">
        <div className="structured-form-field">
          <label className="structured-form-label">Name *</label>
          <input className="structured-form-input" value={fields.name} onChange={set('name')} required />
        </div>
        <div className="structured-form-field">
          <label className="structured-form-label">Email</label>
          <input className="structured-form-input" type="email" value={fields.email} onChange={set('email')} />
        </div>
      </div>

      <div className="structured-form-row">
        <div className="structured-form-field">
          <label className="structured-form-label">Phone</label>
          <input className="structured-form-input" value={fields.phone} onChange={set('phone')} />
        </div>
        <div className="structured-form-field">
          <label className="structured-form-label">Years of Experience</label>
          <input className="structured-form-input" type="number" min="0" value={fields.experienceYears} onChange={set('experienceYears')} />
        </div>
      </div>

      <div className="structured-form-field">
        <label className="structured-form-label">Skills <span className="structured-form-hint">(comma-separated)</span></label>
        <input className="structured-form-input" placeholder="React, Node.js, MongoDB" value={fields.skills} onChange={set('skills')} />
      </div>

      <div className="structured-form-field">
        <label className="structured-form-label">Education</label>
        <input className="structured-form-input" placeholder="BSc Computer Science" value={fields.education} onChange={set('education')} />
      </div>

      <div className="structured-form-field">
        <label className="structured-form-label">Summary</label>
        <textarea className="structured-form-textarea" rows={3} value={fields.summary} onChange={set('summary')} />
      </div>

      <div className="structured-form-actions">
        <button type="button" className="structured-form-cancel-btn" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="structured-form-submit-btn" disabled={saving}>
          {saving ? 'Saving…' : 'Add Applicant'}
        </button>
      </div>
    </form>
  );
}

export default StructuredForm;
