// src/components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const role = localStorage.getItem('adminRole');

  // If no token or not admin, redirect to admin login
  if (!token || role !== 'ADMIN') {
    return <Navigate to="/Adminlogin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;