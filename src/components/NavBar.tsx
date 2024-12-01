import React, { useEffect, useState } from 'react';
import { useAuth } from '../../server/src/context/authContext'
import { useLocation } from "react-router-dom";
import LogoutButton from '../pages/Logout';
import NavigateButton from './NavigateBtn'

const Navbar: React.FC = () => {
  const { email } = useAuth(); // Get email and logout function from context
  const [loading, setLoading] = useState<boolean>(true);  // Add loading state
  const location = useLocation();

  // Extract the page name from the path
  const getPageName = (pathname: string) => {
    // Remove leading and trailing slashes, replace hyphens with spaces, and capitalize
    const cleanedPath = pathname.replace(/^\/|\/$/g, '').replace(/-/g, ' ');
    // Capitalize the first letter of each word
    return cleanedPath
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageName = getPageName(location.pathname);

    useEffect(() => {
      setLoading(false);
  }, []);  // Empty dependency array to run only once when the component mounts

    // Don't show the Navbar on the login page
    if (location.pathname === '/login') 
      return null;
    else if (location.pathname === '/register')
      return null;
    else if (location.pathname === '/')
      return null;
    else if (location.pathname === '/reset-password')
      return null;
    
    if (loading) {
      return <div>Loading...</div>;  // Display loading message or spinner while checking for login status
    }
    return (
      <nav className="tw-fixed tw-grid tw-grid-cols-6 tw-top-0 tw-left-0 tw-w-full tw-py-4 tw-px-8 tw-bg-gray-100 tw-border-b tw-border-gray-300 tw-z-50">
        <div className ="text-start fw-bold tw-text-xl">
          {new Date(Date.now()).toLocaleString('default', { day: 'numeric',month:'long', year:"numeric"})}
        </div>
        <div className="tw-text-3xl tw-font-bold tw-text-gray-800 tw-col-start-3 tw-col-span-2">{pageName}</div>
        <NavigateButton to="/dashboard" label="Back to Dashboard" className='tw-col-start-5 tw-w-48' />
        <div className="tw-items-center tw-space-x-4 tw-col-start-6 tw-justify-self-end">
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
