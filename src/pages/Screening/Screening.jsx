import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, getScreening, runScreening } from '../../services/api';
import ShortlistTable from '../../components/screening/ShortlistTable/ShortlistTable';
import Spinner from '../../components/common/Spinner/Spinner';
import './Screening.css';

function Screening() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getJob(id), getScreening(id).catch(() => null)])
      .then(([jobData, screeningData]) => {
        setJob(jobData);
        setScreening(screeningData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await runScreening(id);
      setScreening(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="screening-page">
      <button className="screening-back" onClick={() => navigate(`/jobs/${id}`)}>
        ← Back to Job
      </button>

      <div className="screening-topbar">
        <div>
          <h1 className="screening-heading">AI Screening</h1>
          {job && <p className="screening-sub">{job.title}</p>}
        </div>
        <button
          className="screening-run-btn"
          onClick={handleRun}
          disabled={running}
        >
          {running ? 'Running…' : screening ? 'Re-run Screening' : 'Run Screening'}
        </button>
      </div>

      {running && (
        <Spinner text="Umurava AI is evaluating candidates…" />
      )}

      {error && <p className="screening-error">{error}</p>}

      {!running && screening && screening.rankedApplicants?.length > 0 && (
        <>
          <div className="screening-meta">
            <span>{screening.rankedApplicants.length} candidates evaluated</span>
            <span className="screening-meta-dot">·</span>
            <span>{screening.rankedApplicants.filter((a) => a.shortlisted).length} shortlisted</span>
            <span className="screening-meta-dot">·</span>
            <span>Last run {new Date(screening.updatedAt).toLocaleString()}</span>
          </div>
          <ShortlistTable rankedApplicants={screening.rankedApplicants} />
        </>
      )}

      {!running && !screening && !error && (
        <div className="screening-empty">
          <p>No screening results yet. Click "Run Screening" to evaluate candidates.</p>
        </div>
      )}
    </div>
  );
}

export default Screening;
