import { useState, useEffect } from 'react';
import { getAllApplicants, deleteApplicant } from '../../services/api';
import ApplicantModal from '../../components/applicants/ApplicantModal/ApplicantModal';
import Spinner from '../../components/common/Spinner/Spinner';
import './AllApplicants.css';

function AllApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllApplicants()
      .then(setApplicants)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await deleteApplicant(id);
    setApplicants((prev) => prev.filter((a) => a._id !== id));
  };

  if (loading) return <Spinner />;
  if (error) return <p className="all-applicants-status all-applicants-status--error">{error}</p>;

  return (
    <div className="all-applicants-page">
      <div className="all-applicants-topbar">
        <div>
          <h1 className="all-applicants-heading">All Applicants</h1>
          <p className="all-applicants-sub">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''} across all jobs</p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="all-applicants-empty">
          <p className="all-applicants-empty-text">No applicants yet.</p>
          <p className="all-applicants-empty-hint">Add applicants from a job's detail page.</p>
        </div>
      ) : (
        <div className="all-applicants-list">
          {applicants.map((a) => (
            <div key={a._id} className="all-applicants-row">
              <div className="all-applicants-row-avatar">
                {a.name.charAt(0).toUpperCase()}
              </div>
              <div className="all-applicants-row-info">
                <span className="all-applicants-row-name">{a.name}</span>
                <span className="all-applicants-row-meta">
                  {a.email && <span>{a.email}</span>}
                  {a.jobId?.title && <span className="all-applicants-row-job">{a.jobId.title}</span>}
                </span>
              </div>
              <div className="all-applicants-row-right">
                {a.experienceYears > 0 && (
                  <span className="all-applicants-row-exp">{a.experienceYears} yr{a.experienceYears !== 1 ? 's' : ''}</span>
                )}
                <span className={`all-applicants-row-source all-applicants-row-source--${a.source}`}>
                  {a.source === 'upload' ? 'CV Upload' : 'Manual'}
                </span>
                <button
                  className="all-applicants-row-view"
                  onClick={() => setSelected(a)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <ApplicantModal applicant={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default AllApplicants;
