import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import CreateMeeting from './pages/CreateMeeting';
import Meetings from './pages/Meetings';
import MeetingDetails from './pages/MeetingDetails';
import Tasks from './pages/Tasks';
import MyTasks from './pages/MyTasks';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Helper to get dashboard path
  const getDashboard = () => (user?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes - always redirect if user exists */}
        <Route path="/login" element={user ? <Navigate to={getDashboard()} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={getDashboard()} replace /> : <Register />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/meetings/create" element={
          <ProtectedRoute requiredRole="admin">
            <CreateMeeting />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute requiredRole="admin">
            <Tasks />
          </ProtectedRoute>
        } />

        {/* Member routes */}
        <Route path="/member/dashboard" element={
          <ProtectedRoute requiredRole="member">
            <MemberDashboard />
          </ProtectedRoute>
        } />
        <Route path="/my-tasks" element={
          <ProtectedRoute requiredRole="member">
            <MyTasks />
          </ProtectedRoute>
        } />

        {/* Shared routes (any authenticated user) */}
        <Route path="/meetings" element={
          <ProtectedRoute>
            <Meetings />
          </ProtectedRoute>
        } />
        <Route path="/meetings/:id" element={
          <ProtectedRoute>
            <MeetingDetails />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={
          user ? <Navigate to={getDashboard()} replace /> : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
