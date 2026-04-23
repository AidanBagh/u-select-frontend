import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getJobs, createJob } from '../../services/api';
import JobCard from '../../components/jobs/JobCard/JobCard';
import JobForm from '../../components/jobs/JobForm/JobForm';
import Spinner from '../../components/common/Spinner/Spinner';
import './Jobs.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const job = await createJob(data);
      setJobs((prev) => [job, ...prev]);
      setShowForm(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    return job.title.toLowerCase().includes(q) || job.description.toLowerCase().includes(q);
  });

  return (
    <div className="jobs-page">
      <div className="jobs-topbar">
        <div>
          <h1 className="jobs-heading">Jobs</h1>
          <p className="jobs-sub">
            {searchQuery ? `${filteredJobs.length} of ${jobs.length}` : jobs.length} active job{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="jobs-new-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : <><Plus size={16} /> New Job</>}
        </button>
      </div>

      {error && <p className="jobs-error">{error}</p>}

      {!loading && jobs.length > 0 && (
        <div className="jobs-search-bar">
          <input
            className="jobs-search-input"
            type="text"
            placeholder="Search jobs by title or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {showForm && (
        <div className="jobs-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="jobs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jobs-modal-header">
              <p className="jobs-modal-title">New Job</p>
              <button className="jobs-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="jobs-modal-body">
              <JobForm
                onSubmit={handleCreate}
                onCancel={() => setShowForm(false)}
                loading={saving}
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : jobs.length === 0 && !showForm ? (
        <p className="jobs-empty">No jobs yet. Create one to get started.</p>
      ) : filteredJobs.length === 0 ? (
        <p className="jobs-empty">No jobs match your search.</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;
