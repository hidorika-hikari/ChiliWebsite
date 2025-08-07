import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    console.log('[DEBUG][ProtectedRoute] userData:', userData, 'token:', token);

    if (!token || userData.role !== 'admin') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;
