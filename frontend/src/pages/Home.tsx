import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { api } from '../services/api';

export default function Home() {
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

      <div className="button-row">
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleCallProtectedApi}>Call Protected API</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p>
        <Link to="/profile">View Profile</Link>
      </p>
    </div>
  );
}
