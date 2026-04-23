import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, getApplicants, deleteApplicant } from '../../services/api';
import ApplicantCard from '../../components/applicants/ApplicantCard/ApplicantCard';
import StructuredForm from '../../components/applicants/StructuredForm/StructuredForm';
import UploadForm from '../../components/applicants/UploadForm/UploadForm';
import ApplicantModal from '../../components/applicants/ApplicantModal/ApplicantModal';
import Spinner from '../../components/common/Spinner/Spinner';
import './Applicants.css';

function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(null); // null | 'manual' | 'upload'
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    Promise.all([getJob(id), getApplicants(id)])
      .then(([jobData, applicantData]) => {
        setJob(jobData);
        setApplicants(applicantData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleManualAdded = (applicant) => {
    setApplicants((prev) => [applicant, ...prev]);
    setMode(null);
  };

  const handleUploadAdded = (newApplicants) => {
    setApplicants((prev) => [...newApplicants, ...prev]);
    setMode(null);
  };

  const handleDelete = async (id) => {
    await deleteApplicant(id);
    setApplicants((prev) => prev.filter((a) => a._id !== id));
  };

  if (loading) return <Spinner />;
  if (error) return <p className="applicants-error">{error}</p>;

  return (
    <div className="applicants-page">
      <button className="applicants-back" onClick={() => navigate(`/jobs/${id}`)}>
        ← Back to Job
      </button>

      <div className="applicants-topbar">
        <div>
          <h1 className="applicants-heading">Applicants</h1>
          <p className="applicants-sub">
            {job?.title} — {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!mode && (
          <div className="applicants-topbar-actions">
            <button className="applicants-upload-btn" onClick={() => setMode('upload')}>
              Upload CV
            </button>
            <button className="applicants-manual-btn" onClick={() => setMode('manual')}>
              + Add Manually
            </button>
          </div>
        )}
      </div>

      {mode === 'manual' && (
        <div className="applicants-modal-overlay" onClick={() => setMode(null)}>
          <div className="applicants-modal" onClick={(e) => e.stopPropagation()}>
            <div className="applicants-modal-header">
              <p className="applicants-modal-title">Add Applicant Manually</p>
              <button className="applicants-modal-close" onClick={() => setMode(null)}>×</button>
            </div>
            <div className="applicants-modal-body">
              <StructuredForm
                jobId={id}
                onAdded={handleManualAdded}
                onCancel={() => setMode(null)}
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <div className="applicants-modal-overlay" onClick={() => setMode(null)}>
          <div className="applicants-modal" onClick={(e) => e.stopPropagation()}>
            <div className="applicants-modal-header">
              <p className="applicants-modal-title">Upload CV</p>
              <button className="applicants-modal-close" onClick={() => setMode(null)}>×</button>
            </div>
            <div className="applicants-modal-body">
              <UploadForm
                jobId={id}
                onAdded={handleUploadAdded}
                onCancel={() => setMode(null)}
              />
            </div>
          </div>
        </div>
      )}

      {applicants.length === 0 && !mode ? (
        <div className="applicants-empty">
          <p className="applicants-empty-text">No applicants yet for this job.</p>
          <p className="applicants-empty-hint">Add one manually or upload a CV above.</p>
        </div>
      ) : (
        <div className="applicants-grid">
          {applicants.map((a) => (
            <ApplicantCard key={a._id} applicant={a} onView={() => setSelectedApplicant(a)} />
          ))}
        </div>
      )}

      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Applicants;
