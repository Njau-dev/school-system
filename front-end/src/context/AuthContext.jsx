import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
    const logIn = (token) => {
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
    const logOut = () => {
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
                logOut();
            }
        }
    }, []);

    return (
        <>
            <div><Toaster /></div>
            <AuthContext.Provider value={{ isAuthenticated, role, logIn, logOut, backendUrl, token }}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
