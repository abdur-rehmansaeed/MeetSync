import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = () => {
    switchRole();
    // Navigate to the other dashboard after switching
    if (user.role === 'admin') {
      navigate('/member/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="logo">MeetSync</div>
      <div className="nav-links">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/meetings">Meetings</Link>
            <Link to="/meetings/create">New Meeting</Link>
            <Link to="/tasks">Tasks</Link>
          </>
        ) : (
          <>
            <Link to="/member/dashboard">Dashboard</Link>
            <Link to="/meetings">Meetings</Link>
            <Link to="/my-tasks">My Tasks</Link>
          </>
        )}
        <span className="user-info">{user.name} ({user.role})</span>
        <button onClick={handleSwitchRole} style={{ background: '#f39c12', marginRight: '4px' }}>
          Switch to {user.role === 'admin' ? 'Member' : 'Admin'}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
