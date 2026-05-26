import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const role = userData.role || 'customer';
    if (!token || !userData.userId || role !== 'customer') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/signin" replace />;
    }
    return children;
};

export default ProtectedRoute;