import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/backend-conf';
import { useAuth } from '../../context/AuthContext';
import { LoginResponse } from '../../utils/types';
import parseJwt from '../../utils/utils';


const Login = () => {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid login credentials');

      const data: LoginResponse = await res.json();
      const { token, refreshToken, tokenExpiration } = data;
      const user = parseJwt(token);

      // Store tokens
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tokenExpiration', tokenExpiration.toString());
      localStorage.setItem('useralldata', JSON.stringify(user));
      
      login();
      scheduleTokenRefresh(tokenExpiration.toString());
      navigate('/');
      
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const scheduleTokenRefresh = (expiration: string) => {
    const expiresIn = new Date(expiration).getTime() - Date.now() - 60000; // 1 minute before expiration
    if (expiresIn > 0) {
      setTimeout(async () => {
        try {
          const { refreshToken } = useAuth();
          await refreshToken();
          // Reschedule next refresh
          const newExpiration = localStorage.getItem('tokenExpiration');
          if (newExpiration) scheduleTokenRefresh(newExpiration);
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }, expiresIn);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-options">
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          </div>
          
          <button type="submit" className="login-button">Sign In</button>


          
        </form>

        <div className="register-link">
          <p>Don't have an account? <a href="/register">Register now</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;