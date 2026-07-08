import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Hub } from 'aws-amplify/utils';
import Home from './pages/Home';
import Profile from './pages/Profile';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fires once Cognito has redirected back and Amplify finished
    // exchanging the auth code for tokens - see amplifyConfig.ts.
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect') {
        navigate('/profile');
      }
    });
    return unsubscribe;
  }, [navigate]);

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
