import React, { useState, useEffect } from 'react';
import './ApplicantModal.css';

function ApplicantModal({ applicant, onClose, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const {
    name, email, phone, source,
    summary, skills, experienceYears,
    workHistory, education, certifications,
  } = applicant;

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="applicant-modal-overlay" onClick={onClose}>
      <div className="applicant-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="applicant-modal-header">
          <div className="applicant-modal-avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="applicant-modal-identity">
            <h2 className="applicant-modal-name">{name}</h2>
            <div className="applicant-modal-contact">
              {email && <span className="applicant-modal-contact-item">{email}</span>}
              {phone && <span className="applicant-modal-contact-item">{phone}</span>}
            </div>
          </div>
          <span className={`applicant-modal-source applicant-modal-source--${source}`}>
            {source === 'upload' ? 'CV Upload' : 'Manual'}
          </span>
          <button className="applicant-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Body */}
        <div className="applicant-modal-body">

          {summary && (
            <section className="applicant-modal-section">
              <h3 className="applicant-modal-section-title">Summary</h3>
              <p className="applicant-modal-summary">{summary}</p>
            </section>
          )}

          {skills?.length > 0 && (
            <section className="applicant-modal-section">
              <h3 className="applicant-modal-section-title">Skills</h3>
              <div className="applicant-modal-skills">
                {skills.map((s, i) => (
                  <span key={i} className="applicant-modal-skill-tag">{s}</span>
                ))}
              </div>
            </section>
          )}

          {(experienceYears > 0 || workHistory?.length > 0) && (
            <section className="applicant-modal-section">
              <h3 className="applicant-modal-section-title">
                Experience{experienceYears > 0 ? ` — ${experienceYears} yr${experienceYears !== 1 ? 's' : ''}` : ''}
              </h3>
              {workHistory?.map((w, i) => (
                <div key={i} className="applicant-modal-work-item">
                  <div className="applicant-modal-work-role">{w.role}</div>
                  <div className="applicant-modal-work-meta">
                    {w.company && <span>{w.company}</span>}
                    {(w.startDate || w.endDate) && (
                      <span>{w.startDate}{w.endDate ? ` — ${w.endDate}` : ''}</span>
                    )}
                  </div>
                  {w.responsibilities?.length > 0 && (
                    <ul className="applicant-modal-work-resp">
                      {w.responsibilities.map((r, j) => (
                        <li key={j}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section className="applicant-modal-section">
              <h3 className="applicant-modal-section-title">Education</h3>
              {education.map((e, i) => (
                <div key={i} className="applicant-modal-edu-item">
                  <div className="applicant-modal-edu-degree">
                    {e.degree}{e.field ? ` in ${e.field}` : ''}
                  </div>
                  <div className="applicant-modal-edu-meta">
                    {e.institution && <span>{e.institution}</span>}
                    {e.year && <span>{e.year}</span>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {certifications?.length > 0 && (
            <section className="applicant-modal-section">
              <h3 className="applicant-modal-section-title">Certifications</h3>
              <ul className="applicant-modal-cert-list">
                {certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          )}

        </div>

        {/* Footer */}
        {onDelete && (
          <div className="applicant-modal-footer">
            {confirming ? (
              <>
                <span className="applicant-modal-confirm-text">Delete this applicant? This cannot be undone.</span>
                <button className="applicant-modal-confirm-cancel" onClick={() => setConfirming(false)}>Cancel</button>
                <button className="applicant-modal-confirm-delete" onClick={() => { onDelete(applicant._id); onClose(); }}>Yes, Delete</button>
              </>
            ) : (
              <button className="applicant-modal-delete-btn" onClick={() => setConfirming(true)}>Delete Applicant</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantModal;
