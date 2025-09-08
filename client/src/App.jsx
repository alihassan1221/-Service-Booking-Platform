import { Routes, Route, Navigate } from 'react-router-dom'; // Removed BrowserRouter as Router
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/dashboard/UserDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import CreateBooking from './pages/bookings/CreateBooking';
import MyBookings from './pages/bookings/MyBookings';
import AllBookings from './pages/bookings/AllBookings';
import UserManagement from './pages/admin/UserManagement';
import ManagerManagement from './pages/admin/ManagerManagement';
import Profile from './pages/profile/Profile';

function App() {
  return (
    // Removed Router component, as HistoryRouter is now in main.jsx
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Redirect based on role */}
          <Route index element={<RoleBasedRedirect />} />
          
          {/* User Routes */}
          <Route path="create-booking" element={
            <ProtectedRoute allowedRoles={['user']}>
              <CreateBooking />
            </ProtectedRoute>
          } />
          <Route path="my-bookings" element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyBookings />
            </ProtectedRoute>
          } />
          
          {/* Manager Routes */}
          <Route path="manager" element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="manager/bookings" element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <AllBookings />
            </ProtectedRoute>
          } />

          <Route path="user" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/managers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManagerManagement />
            </ProtectedRoute>
          } />
          
          {/* Common Routes */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

// Component to redirect users based on their role
const RoleBasedRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'user':
      return <Navigate to="/user" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default App;