import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();

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
    alert('Logged out');
  };

  return (
    <div>
      <h1>AWS Cognito + Lambda Demo</h1>

      <div className="button-row">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={handleCallProtectedApi}>Call Protected API</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p>
        <Link to="/profile">View Profile</Link>
      </p>
    </div>
  );
}
