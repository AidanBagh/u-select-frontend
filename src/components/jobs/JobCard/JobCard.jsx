import { Link } from 'react-router-dom';
import './JobCard.css';

function JobCard({ job }) {
  return (
    <div className="jobcard-container">
      <h3 className="jobcard-title">{job.title}</h3>
      <p className="jobcard-description">
        {job.description.length > 110 ? job.description.slice(0, 110) + '…' : job.description}
      </p>
      <div className="jobcard-footer">
        <span className="jobcard-reqs">
          {job.requirements.length} req{job.requirements.length !== 1 ? 's' : ''}
        </span>
        <Link to={`/jobs/${job._id}`} className="jobcard-link">
          View →
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
