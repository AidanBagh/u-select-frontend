import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-page">
      <span className="notfound-code">404</span>
      <h1 className="notfound-heading">Page not found</h1>
      <p className="notfound-text">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="notfound-link">← Back to Dashboard</Link>
    </div>
  );
}

export default NotFound;
