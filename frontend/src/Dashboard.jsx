import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axiosClient from './axiosClient';
import './Dashboard.css';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/dashboard-data')
      .then(res => {
        setMessage(res.data.message);
        setUser(res.data.user);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <div className="dash-blob dash-blob-1" />
      <div className="dash-blob dash-blob-2" />

      <div className="dashboard-container">
        <header className="dash-header">
          <div className="dash-brand">
            <div className="dash-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="dash-brand-name">FlowAuth</span>
          </div>

          <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </header>

        <section className="dash-hero">
          <div className="dash-avatar">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="dash-greeting">
              {loading ? 'Loading…' : `${message} 👋`}
            </h1>
            <p className="dash-email">{user?.email ?? '—'}</p>
          </div>
        </section>

        <div className="dash-cards">
          <div className="dash-card">
            <div className="card-icon card-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <p className="card-label">Session Status</p>
            <p className="card-value">Active</p>
          </div>

          <div className="dash-card">
            <div className="card-icon card-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="card-label">Auth Method</p>
            <p className="card-value">JWT + Refresh</p>
          </div>

          <div className="dash-card">
            <div className="card-icon card-icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </div>
            <p className="card-label">User ID</p>
            <p className="card-value">{user?.id ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}