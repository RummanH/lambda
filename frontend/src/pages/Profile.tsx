import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

function truncateToken(token: string): string {
  if (token.length <= 20) return token;
  return `${token.slice(0, 10)}...${token.slice(-6)}`;
}

export default function Profile() {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.all([
      authService.getEmail(),
      authService.getUserId(),
      authService.getAccessToken(),
      authService.isAuthenticated(),
    ]).then(([email, userId, token, loggedIn]) => {
      setEmail(email);
      setUserId(userId);
      setToken(token);
      setLoggedIn(loggedIn);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p className="page-subtitle">Your current Cognito session.</p>
        </div>
        <Link to="/" className="link-back">
          &larr; Home
        </Link>
      </div>

      {loading ? (
        <div className="items-empty">Loading...</div>
      ) : (
        <div className="profile-card">
          <div className="profile-row">
            <span className="profile-label">Status</span>
            <span className={`status-pill ${loggedIn ? 'status-on' : 'status-off'}`}>
              {loggedIn ? 'Logged in' : 'Not logged in'}
            </span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{email ?? '—'}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">User ID</span>
            <span className="profile-value mono">{userId ?? '—'}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Access Token</span>
            <span className="profile-value mono">
              {token ? (expanded ? token : truncateToken(token)) : '—'}
            </span>
          </div>
          {token && (
            <div className="profile-row profile-row-action">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? 'Hide token' : 'Expand token'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
