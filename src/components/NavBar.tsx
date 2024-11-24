import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../server/src/context/authContext'
import LogoutButton from '../pages/Logout';

const Navbar: React.FC = () => {
  const { email, logout } = useAuth(); // Get email and logout function from context
  const [loading, setLoading] = useState<boolean>(true);  // Add loading state
  const navigate = useNavigate();

    useEffect(() => {
    setLoading(false);
  }, []);  // Empty dependency array to run only once when the component mounts


    const handleLogout = () => {
      // Remove the token from localStorage to log the user out
      localStorage.removeItem("accessToken");
      navigate('/login');
    };

    // Don't show the Navbar on the login page
    if (location.pathname === '/login') 
      return null;
    else if (location.pathname === '/register')
      return null;
    else if (location.pathname === '/')
      return null;

    if (loading) {
      return <div>Loading...</div>;  // Display loading message or spinner while checking for login status
    }
    return (
      <nav className="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-flex tw-justify-between tw-items-center tw-py-4 tw-px-8 tw-bg-gray-100 tw-border-b tw-border-gray-300 tw-z-50">
        <div className="tw-text-2xl tw-font-bold tw-text-gray-800">Navbar</div>
        <div className="tw-flex tw-items-center tw-space-x-4">
          {email ? (
            <>
              <span className="tw-text-lg tw-text-gray-600">Welcome, {email}</span>
              <LogoutButton/>
            </>
          ) : (
            <span className="tw-text-lg tw-text-gray-600">Please log in</span>
          )}
        </div>
      </nav>
    );
  };

export default Navbar;
