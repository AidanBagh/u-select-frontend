import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ClipboardList, Zap } from 'lucide-react';
import './Landing.css';

const features = [
  {
    Icon: Briefcase,
    title: 'Job Management',
    desc: 'Create and manage job postings with structured requirements and role descriptions.',
  },
  {
    Icon: Users,
    title: 'Applicant Tracking',
    desc: 'Upload CVs or fill structured forms to keep all candidates organised in one place.',
  },
  {
    Icon: ClipboardList,
    title: 'AI Screening',
    desc: 'Let the AI rank and score candidates against your job criteria automatically.',
  },
  {
    Icon: Zap,
    title: 'Smart Assistant',
    desc: 'Ask the built-in AI agent to create jobs, list applicants, or run screenings via chat.',
  },
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <header className="landing-header">
        <div className="landing-header-brand">
          <img src="/logo.jpg" alt="U-Select Logo" className="landing-header-logo" />
          <span className="landing-header-name">U-Select</span>
        </div>
        <button className="landing-header-login-btn" onClick={() => navigate('/dashboard')}>
          Login
        </button>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-badge">Powered by AI</div>
        <h1 className="landing-hero-title">
          Smarter Hiring with <span className="landing-hero-accent">Umurava Select</span>
        </h1>
        <p className="landing-hero-subtitle">
          An AI-powered recruiting platform that helps you post jobs, manage applicants,
          and screen candidates — all in one place.
        </p>
        <button className="landing-hero-cta" onClick={() => navigate('/dashboard')}>
          Get Started
        </button>
      </section>

      <section className="landing-features">
        <h2 className="landing-features-title">Everything you need to hire better</h2>
        <div className="landing-features-grid">
          {features.map(({ Icon, title, desc }) => (
            <div key={title} className="landing-feature-card">
              <div className="landing-feature-icon">
                <Icon size={22} />
              </div>
              <h3 className="landing-feature-card-title">{title}</h3>
              <p className="landing-feature-card-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p className="landing-footer-text">© 2026 Umurava Select · AI Recruiting Platform</p>
      </footer>
    </div>
  );
}

export default Landing;
