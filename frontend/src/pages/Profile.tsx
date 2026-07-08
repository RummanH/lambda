import { useEffect, useState } from 'react';
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

  if (loading) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Profile</h1>

      <p>
        <strong>Login status:</strong> {loggedIn ? 'Logged in' : 'Not logged in'}
      </p>
      <p>
        <strong>Email:</strong> {email ?? '-'}
      </p>
      <p>
        <strong>User ID:</strong> {userId ?? '-'}
      </p>
      <p>
        <strong>Access Token:</strong>{' '}
        {token ? (
          <>
            <code>{expanded ? token : truncateToken(token)}</code>{' '}
            <button onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Hide' : 'Expand'}
            </button>
          </>
        ) : (
          '-'
        )}
      </p>
    </div>
  );
}
