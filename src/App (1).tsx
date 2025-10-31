import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import RepairJobForm from './pages/RepairJobForm'; // (From previous response)
import BillingPage from './pages/BillingPage';     // (From previous response)
import InventoryPage from './pages/InventoryPage';
import CustomerDatabase from './pages/CustomerDatabase';
import Login from './pages/Login'; // You would create a Login page component
import NavBar from './components/NavBar'; // A simple navigation bar

// A component to protect routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div>Loading Application...</div>; 
  if (!currentUser) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

const AppContent: React.FC = () => {
    const { currentUser } = useAuth();
    return (
        <>
            {currentUser && <NavBar />} {/* Show Navbar only if logged in */}
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/repair/new" element={<ProtectedRoute><RepairJobForm /></ProtectedRoute>} />
                <Route path="/billing/:jobId" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} /> 
                <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><CustomerDatabase /></ProtectedRoute>} />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
