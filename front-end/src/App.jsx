import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import LecturerDashboard from "./pages/dashboard/LecturerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Assignments from "./pages/dashboard/Assignments";
import Submissions from "./pages/dashboard/Submissions";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

const App = () => {
  const { isAuthenticated, role } = useAuth();

  // Component to handle protected routes
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  // Dynamically render dashboards based on role
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

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Register />} />
        <Route path="/signin" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {getDashboard()}
            </PrivateRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <PrivateRoute>
              <Assignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/submissions"
          element={
            <PrivateRoute>
              <Submissions />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
