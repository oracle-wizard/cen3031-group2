import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import UpdateAccount from './pages/UpdateAccount';

import ResetPassword from './pages/ResetPasswordPage';
import ExpenseTracker from './pages/ExpenseTracker';
import BudgetCategory from './pages/BudgetCategory';
import Layout from './pages/Layout';
import UserIncome from './pages/UserIncome';
import InactivityHandler from './components/InactivityHandler'; // Import the InactivityHandler
import Dashboard from './pages/Dashboard';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <InactivityHandler>
        <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/update-account" element={<UpdateAccount />} />
              <Route path="/dashboard" element ={<Dashboard/>} />
              <Route path ="/reset-password" element = {<ResetPassword/>}/>
              <Route path="/expense-tracker" element={<ExpenseTracker />} /> 
              <Route path="/budget-category" element={<BudgetCategory />} />
              <Route path="/user-income" element={<UserIncome />} />
          </Routes>
          </Layout>
      </InactivityHandler>
    </Router>
  );
};

export default App;