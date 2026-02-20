import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import MyAssets from '../pages/MyAssets';

const ProtectedRoutes = () => {
    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-assets"
                element={
                    <ProtectedRoute>
                        <MyAssets />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default ProtectedRoutes;
