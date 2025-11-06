import React, { useState, useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import '../../styles/Account.css';

export default function LogIn() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ for redirecting after login

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle Google login success
  const handleLoginSuccess = (credentialResponse) => {
    try {
      
      const user = jwtDecode(credentialResponse.credential);

      // Save in AuthContext
      login(user);
  
      // Save Google user in localStorage for ProfileHeader fallback
      localStorage.setItem(
        'googleUser',
        JSON.stringify({
          name: user.name,
          email: user.email,
          picture: user.picture,
        })
      );
  
      console.log('Google user:', user);
  
      // Redirect after short delay to ensure context updates
      setTimeout(() => navigate('/account'), 100);
    } catch (error) {
      console.error('Error decoding Google credential:', error);
    }
  };
  

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle email/password form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Sign up logic
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      // Placeholder for signup API
      const newUser = {
        name: formData.email,
        email: formData.email,
        picture: null,
      };

      login(newUser);
      localStorage.setItem('googleUser', JSON.stringify(newUser));
      navigate('/account');
      console.log('Signed up with:', formData);
    } else {
      // Login logic
      const existingUser = {
        name: formData.email,
        email: formData.email,
        picture: null,
      };

      login(existingUser);
      localStorage.setItem('googleUser', JSON.stringify(existingUser));
      navigate('/account');
      console.log('Logged in with:', formData);
    }
  };

  return (
    <div className="login-page d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="account-box p-4 shadow rounded text-center">
        <h2 className="mb-4">{isSignUp ? 'Create an Account' : 'Sign in to Thryft'}</h2>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '320px' }}>
          <div className="form-group mb-3 text-start">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3 text-start">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group mb-3 text-start">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="divider my-3">or</div>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log('Google Login Failed')}
        />

        {/* Toggle between Login and Sign Up */}
        <p className="mt-4">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(false)}>
                Log In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
