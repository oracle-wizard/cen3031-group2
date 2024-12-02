// Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from '../components/NavBar';
import { AuthProvider } from '../../server/src/context/authContext'

interface LayoutProps {
    children: ReactNode; // Explicitly define the type of children
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="tw-h-screen">
            <AuthProvider>
            <Navbar />
            <main className='tw-mt-20'>
            {children}
            </main>
            </AuthProvider>
        </div>
    );
};

export default Layout;
