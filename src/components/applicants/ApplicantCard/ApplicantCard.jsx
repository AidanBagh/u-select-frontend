import './ApplicantCard.css';

function ApplicantCard({ applicant, onView }) {
  const { name, email, phone, skills, experienceYears, education, source } = applicant;

  return (
    <div className="applicant-card">
      <div className="applicant-card-header">
        <div className="applicant-card-avatar">{name.charAt(0).toUpperCase()}</div>
        <div className="applicant-card-info">
          <h3 className="applicant-card-name">{name}</h3>
          <div className="applicant-card-meta">
            {email && <span className="applicant-card-meta-item">{email}</span>}
            {phone && <span className="applicant-card-meta-item">{phone}</span>}
          </div>
        </div>
        <span className={`applicant-card-source applicant-card-source--${source}`}>
          {source === 'upload' ? 'CV Upload' : 'Manual'}
        </span>
      </div>

      <div className="applicant-card-body">
        {skills.length > 0 && (
          <div className="applicant-card-skills">
            {skills.slice(0, 6).map((s, i) => (
              <span key={i} className="applicant-card-skill-tag">{s}</span>
            ))}
            {skills.length > 6 && (
              <span className="applicant-card-skill-more">+{skills.length - 6}</span>
            )}
          </div>
        )}

        <div className="applicant-card-footer">
          {experienceYears > 0 && (
            <span className="applicant-card-exp">{experienceYears} yr{experienceYears !== 1 ? 's' : ''} exp</span>
          )}
          {education?.length > 0 && (
            <span className="applicant-card-edu">
              {education[0].degree}
              {education[0].field ? ` in ${education[0].field}` : ''}
              {education[0].institution ? `, ${education[0].institution}` : ''}
            </span>
          )}
        </div>

        <div className="applicant-card-actions">
          <button className="applicant-card-view-btn" onClick={onView}>View Details</button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantCard;
