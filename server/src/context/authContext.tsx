import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
}
interface AuthProps {
    children: ReactNode; // Explicitly define the type of children
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProps> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);

  // Load the email from localStorage on initial load
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const login = (email: string) => {
    localStorage.setItem('email', email); // Store the email in localStorage
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('email');
    setEmail(null); // Clear the email on logout
  };

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
