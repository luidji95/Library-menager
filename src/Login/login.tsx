import React from 'react'
import Input from '../components/ui/Input'
import './login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className='login-form-wrapper'>
      <div className='h1-headline'>
        <h1>Library Management System</h1>
      </div>
      <div className='login-icon'>
        <h3>Admin Login</h3>
      </div>

      <form className='login-form' onSubmit={handleSubmit}>
        <Input 
          placeholder="Email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />

        <Input 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />

        <div className='login-btn'>
          <button type="submit">Login</button>
        </div>
      </form>

      <div className='login-info'>
        <div className='info-h'>
          <p><b>Use login info</b></p>
        </div>
        <div className='info-value'>
          <p>Email Address: <b>testadmin@library.com</b></p>
          <p>Password: <b>testpassword</b></p>
        </div>
      </div>
    </div>
  );
}
