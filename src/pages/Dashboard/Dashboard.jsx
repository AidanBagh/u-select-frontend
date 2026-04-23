import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getJobs, getAllApplicants, getStats } from '../../services/api';
import './Dashboard.css';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, screeningsRun: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getJobs(), getAllApplicants(), getStats()])
      .then(([jobsData, applicantsData, statsData]) => {
        setJobs(jobsData);
        setRecentApplicants(applicantsData.slice(0, 5));
        setStats(statsData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <div>
          <h1 className="dashboard-heading">Dashboard</h1>
          <p className="dashboard-sub">Welcome back — here's what's happening</p>
        </div>
        <div className="dashboard-topbar-actions">
          <button className="dashboard-cta" onClick={() => navigate('/jobs')}>
            <Plus size={16} />
            Post a Job
          </button>
        </div>
      </div>

      <div className="dashboard-stats-row">
        {error && <p className="dashboard-error">{error}</p>}
        <div className="dashboard-stat">
          <span className="dashboard-stat-num">{loading ? '—' : stats.totalJobs}</span>
          <span className="dashboard-stat-lbl">Active Jobs</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-num">{loading ? '—' : stats.totalApplicants}</span>
          <span className="dashboard-stat-lbl">Total Applicants</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-num">{loading ? '—' : stats.screeningsRun}</span>
          <span className="dashboard-stat-lbl">Screenings Run</span>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent Jobs</h2>
          <Link to="/jobs" className="dashboard-section-link">View all →</Link>
        </div>

        {loading ? (
          <p className="dashboard-empty">Loading…</p>
        ) : jobs.length === 0 ? (
          <div className="dashboard-empty-state">
            <p className="dashboard-empty">No jobs yet.</p>
            <button className="dashboard-cta" onClick={() => navigate('/jobs')}>Create your first job</button>
          </div>
        ) : (
          <div className="dashboard-jobs-list">
            {jobs.slice(0, 5).map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="dashboard-job-row">
                <div className="dashboard-job-info">
                  <span className="dashboard-job-title">{job.title}</span>
                  <span className="dashboard-job-reqs">{job.requirements.length} requirements</span>
                </div>
                <div className="dashboard-job-meta">
                  <span className="dashboard-job-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent Applicants</h2>
          <Link to="/applicants" className="dashboard-section-link">View all →</Link>
        </div>
        {loading ? (
          <p className="dashboard-empty">Loading…</p>
        ) : recentApplicants.length === 0 ? (
          <p className="dashboard-empty">No applicants yet.</p>
        ) : (
          <div className="dashboard-jobs-list">
            {recentApplicants.map((a) => (
              <div key={a._id} className="dashboard-applicant-row">
                <div className="dashboard-applicant-avatar">{a.name.charAt(0).toUpperCase()}</div>
                <div className="dashboard-job-info">
                  <span className="dashboard-job-title">{a.name}</span>
                  <span className="dashboard-job-reqs">{a.jobId?.title || 'Unknown job'}</span>
                </div>
                <div className="dashboard-job-meta">
                  <span className={`dashboard-applicant-source dashboard-applicant-source--${a.source}`}>
                    {a.source === 'upload' ? 'CV Upload' : 'Manual'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
