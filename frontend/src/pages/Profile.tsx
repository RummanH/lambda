import { useState } from 'react';
import { authService } from '../services/authService';

function truncateToken(token: string): string {
  if (token.length <= 20) return token;
  return `${token.slice(0, 10)}...${token.slice(-6)}`;
}

export default function Profile() {
  const [expanded, setExpanded] = useState(false);

  const email = authService.getEmail();
  const userId = authService.getUserId();
  const token = authService.getAccessToken();
  const loggedIn = authService.isAuthenticated();

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
