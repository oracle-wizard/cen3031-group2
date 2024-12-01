import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '@/styles/UpdateAccount.css';

const UpdateAccount: React.FC = () => {
  // State to store form input
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    newEmail: ''
  });

  // State to handle messages
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update the specific field in formData
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setSuccess('');
    setError('');

    try {
      const response = await api.put('/update-account', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setSuccess('User details updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user details.');
    }
  };

  return (
    <div className="text-center">
      <form className="form-register" onSubmit={handleSubmit}>
      <img className="mb-4" src="../assets/summit.png" alt="Logo" width="144" height="144" />
      <h1 className="h3 mb-3 font-weight-normal">Update Account</h1>

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
            name="newEmail"
            className="form-control"
            placeholder="New Email Address"
            value={formData.newEmail}
            onChange={handleChange}
            required
          />

        <button className="btn btn-lg btn-primary btn-block mt-3" type="submit">Update</button>

        <div>
        <button
          type="button"
          className="btn btn-lg btn-secondary btn-block mt-3" /* Added `mt-3` for spacing */
          onClick={goToDashboard}>
          Dashboard
        </button>
        </div>

      {/* Display success or error messages */}

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      </form>
    </div>
  );
};

export default UpdateAccount;
