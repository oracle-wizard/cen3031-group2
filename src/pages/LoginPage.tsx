import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted with email:", email, "and password:", password);
  };

    // Function to navigate to the registration page
    const goToRegister = () => {
      navigate('/register');
    };

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
      </form>
    </div>
  );
};

export default LoginPage;
