import React, { ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface InactivityHandlerProps {
    children: ReactNode; // Define the type for children
}

const InactivityHandler: React.FC<InactivityHandlerProps> = ({ children }) => {
    const navigate = useNavigate();
    const INACTIVITY_TIME = 6000000; // 1 minute in milliseconds
    let inactivityTimer: NodeJS.Timeout;

    // Function to handle logout
    const handleLogout = useCallback(() => {
        console.log("User logged out due to inactivity.");
        localStorage.removeItem('accessToken'); // Remove access token
        document.cookie = "refreshToken=; Max-Age=0; path=/;"; // Clear refresh token cookie
        navigate('/login'); // Redirect to login
    }, [navigate]);

    // Function to reset inactivity timer
    const resetTimer = useCallback(() => {
        console.log("Activity detected. Resetting timer.");
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIME); // Set new timer
    }, [handleLogout]);

    useEffect(() => {
        // Set up event listeners for user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);

        // Initialize the inactivity timer
        resetTimer();

        return () => {
            // Clean up event listeners and timer
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
        };
    }, [resetTimer]);

    return <>{children}</>; // Render children (e.g., your app content)
};

export default InactivityHandler;
