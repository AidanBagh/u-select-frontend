import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Users, Pencil, Trash2 } from 'lucide-react';
import { getJob, updateJob, deleteJob } from '../../services/api';
import JobForm from '../../components/jobs/JobForm/JobForm';
import Spinner from '../../components/common/Spinner/Spinner';
import './JobDetail.css';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const updated = await updateJob(id, data);
      setJob(updated);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(id);
      navigate('/jobs');
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="jobdetail-error">{error}</p>;
  if (!job) return null;

  return (
    <div className="jobdetail-page">
      <button className="jobdetail-back" onClick={() => navigate('/jobs')}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      {editing ? (
        <div className="jobdetail-form-wrapper">
          <JobForm
            initialData={job}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            loading={saving}
          />
        </div>
      ) : (
        <div className="jobdetail-card">
          <div className="jobdetail-card-header">
            <div>
              <h1 className="jobdetail-title">{job.title}</h1>
              <p className="jobdetail-date">
                Created {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="jobdetail-action-btns">
              <button className="jobdetail-screening-btn" onClick={() => navigate(`/jobs/${id}/screening`)}><Play size={15} /> Run Screening</button>
              <button className="jobdetail-applicants-btn" onClick={() => navigate(`/jobs/${id}/applicants`)}><Users size={15} /> Applicants</button>
              <button className="jobdetail-edit-btn" onClick={() => setEditing(true)}><Pencil size={15} /> Edit</button>
              <button className="jobdetail-delete-btn" onClick={handleDelete}><Trash2 size={15} /> Delete</button>
            </div>
          </div>

          <div className="jobdetail-card-body">
            <div>
              <p className="jobdetail-section-label">Description</p>
              <p className="jobdetail-description">{job.description}</p>
            </div>

            {job.requirements.length > 0 && (
              <div>
                <p className="jobdetail-section-label">Requirements</p>
                <ul className="jobdetail-reqs-list">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="jobdetail-req-tag">{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="jobdetail-section-label">Scoring Weights</p>
              <div className="jobdetail-weights-grid">
                {Object.entries(job.weights).map(([k, v]) => (
                  <div key={k} className="jobdetail-weight-item">
                    <span className="jobdetail-weight-key">{k}</span>
                    <span className="jobdetail-weight-val">{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
