import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Assignments from "./pages/dashboard/Assignments";
import Submissions from "./pages/dashboard/Submissions";
import Profile from "./pages/dashboard/Profile";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AssignmentDetails from "./components/AssignmentDetails";

const App = () => {
  const { isAuthenticated } = useAuth();

  // Component to handle protected routes
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<Register />} />
      <Route path="/signin" element={<Login />} />

      {/* Protected Routes - All wrapped in DashboardLayout */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/assignments/:id" element={<AssignmentDetails />} />
        <Route path="/submissions" element={<Submissions />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
    </Routes>
  );
};

export default App;