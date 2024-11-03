import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/register');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="homepage">
      <h1>Welcome to SummitSavings Test Menu</h1>
      <p>Click a button below to register or log in.</p>
      <button onClick={goToRegister} className="homepage-button">Register</button>
      <button onClick={goToLogin} className="homepage-button">Login</button>
    </div>
  );
};

export default HomePage;

