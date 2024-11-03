import React, { useState } from 'react';
import './styles/RegistrationPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here, e.g., sending data to backend
    console.log("Form submitted with data:", formData);
  };

  return (
    <div className="text-center">
      <form className="form-register" onSubmit={handleSubmit}>
        <img className="mb-4" src="./assets/summit.png" alt="Logo" width="144" height="144" />
        <h1 className="h3 mb-3 font-weight-normal">Register Account</h1>
        
        <label htmlFor="inputFirstName" className="sr-only">First Name</label>
        <input
          type="text"
          id="inputFirstName"
          name="firstName"
          className="form-control"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          autoFocus
        />

        <label htmlFor="inputLastName" className="sr-only">Last Name</label>
        <input
          type="text"
          id="inputLastName"
          name="lastName"
          className="form-control"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input
          type="email"
          id="inputEmail"
          name="email"
          className="form-control"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword"
          name="password"
          className="form-control"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="form-control"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        
        <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
