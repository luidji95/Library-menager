import React, { useState } from 'react';
import Login from './Login/login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (email: string, password: string) => {
    if (email === 'testadmin@library.com' && password === 'testpassword') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return isLoggedIn ? (
    <Dashboard />
  ) : (
    <Login onLogin={handleLogin} />
  );
};

export default App;
