import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Menu, X, MessageSquare, Settings, LogOut, ClipboardList } from 'lucide-react';
import ChatBox from '../../chat/ChatBox/ChatBox';
import './Layout.css';

const nav = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', Icon: Briefcase },
  { to: '/applicants', label: 'Applicants', Icon: Users },
  { to: '/screenings', label: 'Screenings', Icon: ClipboardList },
];

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(() => window.innerWidth >= 1100);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100) {
        setIsChatOpen(false);
      }
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`layout-root ${isChatOpen ? 'layout-root--chat-open' : ''}`}>
      {isOpen && <div className="layout-overlay" onClick={() => setIsOpen(false)}></div>}
      <aside className={`layout-sidebar ${isOpen ? 'layout-sidebar--open' : ''}`}>
        <div className="layout-sidebar-brand">
          <span className="layout-sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.jpg" alt="U-Select Logo" style={{ height: '28px', width: 'auto', borderRadius: '4px' }} />
            U-Select
          </span>
          <span className="layout-sidebar-tagline">AI Recruiting</span>
          {isOpen && (
            <button className="layout-mobile-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>
        <nav className="layout-nav">
          {nav.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                'layout-nav-item' + (isActive ? ' layout-nav-item--active' : '')
              }
            >
              <Icon size={16} className="layout-nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="layout-sidebar-bottom">
          <button
            className="layout-nav-item layout-logout-btn"
            onClick={() => { setIsOpen(false); navigate('/dashboard'); }}
          >
            <Settings size={16} className="layout-nav-icon" />
            <span>Settings</span>
          </button>
          <button className="layout-nav-item layout-logout-btn" onClick={() => navigate('/')}>
            <LogOut size={16} className="layout-nav-icon" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
      <main className="layout-main">
        <header className="layout-mobile-header">
          <button className="layout-mobile-toggle" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="layout-mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.jpg" alt="U-Select Logo" style={{ height: '24px', width: 'auto', borderRadius: '4px' }} />
            U-Select
          </span>
        </header>
        {children}
      </main>
      {!isChatOpen && (
        <button className="layout-chat-toggle" onClick={() => setIsChatOpen(true)} aria-label="Open AI Chat">
          <MessageSquare size={20} />
          <span className="layout-chat-toggle-label">Umurava AI</span>
        </button>
      )}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default Layout;

