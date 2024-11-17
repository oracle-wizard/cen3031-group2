import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance'
import '@/styles/RegistrationPage.css';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Function to navigate to the registration page
  const goToLogin = () => {
    navigate('/login');
  };
  const validatePassword = (password : string)=>{
   
    if(password.length<8 || !/\d/.test(password) || ! /[A-Z]/.test(password) ||  ! /[a-z]/.test(password) ){
        return 'Password must contain at least one number.'
    }
    return '';
   }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }
    const  passwordErr = validatePassword(formData.password);
    if(passwordErr){
      setMessage(`Password must be at least 8 characters, 1 number, 1 special character, 1 uppercase.`);
      return;
    }

    try {
      const response = await api.post('/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }
      );


      if (response.status === 200){
        setMessage('User registered successfully.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        const {accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken)
      console.log( 'access token has been succcessfully stored at frontend') 
      console.log(accessToken)
        navigate('/login')
      } //will throw an error if status code is not 2xx by default, no need for else anymore
    } catch (error) {
      console.error('Error:', error);
      setMessage('Registration failed.');
    }
  };

  return (
    <div className="text-center">
      <form className="form-register" onSubmit={handleSubmit}>
        <img className="mb-4" src="../assets/summit.png" alt="Logo" width="144" height="144" />
        <h1 className="h3 mb-3 font-weight-normal">Register Account</h1>

        <input
          type="text"
          name="firstName"
          className="form-control"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          autoFocus
        />

        <input
          type="text"
          name="lastName"
          className="form-control"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          className="form-control"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />


        <div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </div>
        {/* Home Button Below with Margin */}
        <button
          type="button"
          className="btn btn-lg btn-secondary btn-block mt-3" /* Added `mt-3` for spacing */
          onClick={goToLogin}
        >
          Sign in
        </button>
        
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default RegistrationPage;
