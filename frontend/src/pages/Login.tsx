import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // TODO(AWS): errors from Cognito (wrong password, user not found, etc.)
    // should be surfaced here once authService.login() actually calls Cognito.
    await authService.login(email, password);
    navigate('/profile');
  };

  return (
    <div>
      <h1>Login</h1>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
