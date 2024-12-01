import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance'
import '@/styles/LoginPage.css';
import logo from '../assets/summit-savings-logo.jpg'
import { useAuth } from '../../server/src/context/authContext'

const LoginPage: React.FC = () => {
  const { login } = useAuth(); // Destructure the login function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage]  = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });

      const { accessToken } = response.data;
      // Decode the token to get the user's email
      localStorage.setItem('accessToken', accessToken); // Store accessToken
      console.log('Access Token stored successfully.');
      login(email);
      navigate('/dashboard'); // Redirect to the dashboard
  } catch (error) {
      if (error.response?.status === 401) {
          setErrorMessage('Invalid credentials.');
      } else {
          setErrorMessage('An error occurred during login.');
      }
      console.error('Error:', error);
  }
};

    // Function to navigate to the registration page
    const goToRegister = () => {
      navigate('/register');
    };
    const goToResetPassword =()=>{
      navigate('/password');
    }

  return (
    <div className="text-center tw-flex tw-w-[900px] tw-justify-between tw-pb-24 tw-mt-96">
          <div className=''>
              <div style={{ backgroundColor: 'white', textAlign: 'center', marginTop: '20px' }}>
                <img 
                    src={logo} 
                    alt="SummitSavings Logo" 
                    style={{ width: '400px', height: 'auto' }} 
                />
            </div>
            <p className="tw-text-xl tw-font-bold tw-text-center tw-text-gray-800 tw-mt-4 tw-leading-relaxed">
              Elevate Your Financial Goals
            </p>      
          </div>
          <div className='tw-w-[400px]'>
          <form className="form-signin" onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">Sign In</h1>

          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          {errorMessage && <p className="message">{errorMessage} </p>}
          <div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          </div>
          {/* Register Button Below with Margin */}
            <button
            type="button"
            className="btn btn-lg btn-secondary btn-block mt-3" /* Added `mt-3` for spacing */
            onClick={goToRegister}
          >
            Register
          </button>
          <div className="form-group" >
            <a href='/reset-password' className='btn-link'>Forgot password?</a>
          </div>
        </form>
        </div>
    </div>
  );
};

export default LoginPage;
