import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { api } from '../services/api';

export default function Home() {
  // null while the session check is in flight, so we don't flash the
  // wrong button before we know whether the user is signed in.
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    authService.isAuthenticated().then(setLoggedIn);
  }, []);

  const handleLogin = () => {
    // Sends the browser to Cognito's Hosted UI - login and sign-up both
    // happen there, not in this app. See amplifyConfig.ts / App.tsx for
    // what happens when Cognito redirects back.
    authService.login();
  };

  const handleCallProtectedApi = async () => {
    try {
      const response = await api.get('/profile');
      alert(JSON.stringify(response.data, null, 2));
    } catch (error) {
      alert('Call failed - are you logged in? See console for details.');
      console.error(error);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div>
      <h1>AWS Cognito + Lambda Demo</h1>
      <p>Sign in with Cognito, then call the protected NestJS API.</p>

      <div className="button-row">
        {loggedIn === null ? null : loggedIn ? (
          <>
            <button className="btn btn-ghost" onClick={handleCallProtectedApi}>
              Call Protected API
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>

      <div className="links-row">
        <Link to="/profile">View Profile</Link>
        <Link to="/items">Manage Items</Link>
      </div>
    </div>
  );
}
