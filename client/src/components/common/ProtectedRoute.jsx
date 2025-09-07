import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are specified, check if user has one of them
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'user':
        return <Navigate to="/my-bookings" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;