import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance'
import './styles/LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage]  = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted with email:", email, "and password:", password);
    try{
      const response = await api.post('/login', {email, password});

      if(response.status!==200){
        const errorData = await response.data;
        setErrorMessage('Login failed')
        throw new Error(errorData.error || 'Login failed')
      }
      const {accessToken } =  response.data;
      console.log('obtained accessToken upon login')
      localStorage.setItem('accessToken', accessToken);
      console.log(localStorage.getItem('accessToken'))
      navigate('/dashboard');
    }
    catch(error){
      if (error.response && error.response.status === 401) {
        setErrorMessage("Unauthorized: Please check your credentials or register."); // Optional: redirect to login if not already there
    } else {
        setErrorMessage('Login failed.');
        console.error('Error:', error);
    }
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
    <div className="text-center">
      <form className="form-signin" onSubmit={handleSubmit}>
        <img className="mb-4" src="../assets/summit.png" alt="Logo" width="144" height="144" />
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
    
  );
};

export default LoginPage;
