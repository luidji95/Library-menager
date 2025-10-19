import React from 'react'
import Input from '../components/ui/Input'
import './login.css'

export default function Login() {
  return (
    <div className='login-form-wrapper'>
      <div className='h1-headline'>
        <h1>Library Management System</h1>
      </div>
      <div className='login-icon'>
        <h3>Admin Login</h3>
      </div>
      <div className='login-form'>
        <Input placeholder="Email address" value="" onChange={() => {}} />
        <Input placeholder="Password" type="password" value="" onChange={() => {}} />
      </div>
      <div className='login-btn'>
        <button>Login</button>
      </div>
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
  )
}
