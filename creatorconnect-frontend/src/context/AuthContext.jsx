import { useState, useEffect } from 'react';
import { getCurrentUser } from '../api/authApi';
import { AuthContext } from './authContextValue';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await getCurrentUser();
            if (response.success) {
                setUser(response.user);
                setIsAuthenticated(true);
            }
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
