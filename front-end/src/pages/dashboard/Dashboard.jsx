import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import LecturerDashboard from './LecturerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { role } = useAuth();

    // Render dashboard based on user role
    const getDashboard = () => {
        switch (role) {
            case "student":
                return <StudentDashboard />;
            case "lecturer":
                return <LecturerDashboard />;
            case "admin":
                return <AdminDashboard />;
            default:
                return <Navigate to="/signin" />;
        }
    };

    return getDashboard();
};

export default Dashboard;