import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    // Helper function to decode JWT
    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error("Invalid token");
            return null;
        }
    };

    // Function to handle login
    const login = (token) => {
        const decoded = decodeToken(token);
        if (decoded) {
            setToken(token);
            setIsAuthenticated(true);
            setRole(decoded.role);
            localStorage.setItem("authToken", token);
            navigate("/dashboard");
        } else {
            console.error("Failed to log in: Invalid token");
        }
    };

    // Function to handle logout
    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setRole(null);
        localStorage.removeItem("authToken");
        navigate("/signin");
    };

    // Check token validity on app load
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            const decoded = decodeToken(storedToken);
            const isTokenValid = decoded && decoded.exp * 1000 > Date.now();
            if (isTokenValid) {
                setToken(storedToken);
                setIsAuthenticated(true);
                setRole(decoded.role);
            } else {
                // Log out if token is expired
                logout();
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
