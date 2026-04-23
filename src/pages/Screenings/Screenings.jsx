import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { getAllScreenings } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';
import './Screenings.css';

function scoreColor(score) {
  if (score >= 75) return 'var(--green)';
  if (score >= 50) return '#f59e0b';
  return 'var(--red)';
}

function Screenings() {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllScreenings()
      .then(setScreenings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="screenings-page">
      <div className="screenings-topbar">
        <div>
          <h1 className="screenings-heading">Screenings</h1>
          <p className="screenings-sub">All AI screening results across your jobs</p>
        </div>
      </div>

      {error && <p className="screenings-error">{error}</p>}

      {!error && screenings.length === 0 && (
        <div className="screenings-empty">
          <ClipboardList size={40} className="screenings-empty-icon" />
          <p className="screenings-empty-text">No screenings run yet.</p>
          <p className="screenings-empty-hint">Go to a job and click "Run Screening" to get started.</p>
          <button className="screenings-go-btn" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
      )}

      {screenings.length > 0 && (
        <div className="screenings-list">
          {screenings.map((s) => {
            const jobId = s.jobId?._id || s.jobId;
            const jobTitle = s.jobId?.title || 'Unknown Job';
            const total = s.rankedApplicants?.length ?? 0;
            const shortlisted = s.rankedApplicants?.filter((a) => a.shortlisted).length ?? 0;
            const topScore = total > 0 ? Math.max(...s.rankedApplicants.map((a) => a.score ?? 0)) : null;

            return (
              <div
                key={s._id}
                className="screenings-card"
                onClick={() => navigate(`/jobs/${jobId}/screening`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/jobs/${jobId}/screening`)}
              >
                <div className="screenings-card-main">
                  <span className="screenings-card-title">{jobTitle}</span>
                  <span className="screenings-card-date">
                    Last run {new Date(s.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="screenings-card-stats">
                  <div className="screenings-stat">
                    <span className="screenings-stat-num">{total}</span>
                    <span className="screenings-stat-lbl">Evaluated</span>
                  </div>
                  <div className="screenings-stat">
                    <span className="screenings-stat-num screenings-stat-shortlisted">{shortlisted}</span>
                    <span className="screenings-stat-lbl">Shortlisted</span>
                  </div>
                  {topScore !== null && (
                    <div className="screenings-stat">
                      <span
                        className="screenings-stat-num"
                        style={{ color: scoreColor(topScore) }}
                      >
                        {topScore}
                      </span>
                      <span className="screenings-stat-lbl">Top Score</span>
                    </div>
                  )}
                </div>
                <ChevronRight size={18} className="screenings-card-arrow" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Screenings;
