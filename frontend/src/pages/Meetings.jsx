import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await API.get('/meetings');
        setMeetings(res.data);
      } catch (err) {
        setError('Failed to load meetings');
      }
      setLoading(false);
    };
    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await API.delete(`/meetings/${id}`);
      setMeetings(meetings.filter((m) => m._id !== id));
    } catch (err) {
      setError('Failed to delete meeting');
    }
  };

  if (loading) return <div className="loading">Loading meetings...</div>;

  return (
    <div className="page-container">
      <div className="flex-between">
        <h1 className="page-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>Meetings</h1>
        {user.role === 'admin' && (
          <Link to="/meetings/create" className="btn btn-primary">+ New Meeting</Link>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}

      {meetings.length === 0 ? (
        <p>No meetings found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Attendees</th>
                <th>Action Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((m) => (
                <tr key={m._id}>
                  <td><Link to={`/meetings/${m._id}`}>{m.title}</Link></td>
                  <td>{new Date(m.date).toLocaleDateString()}</td>
                  <td>{m.attendees?.length || 0}</td>
                  <td>{m.actionItems?.length || 0}</td>
                  <td>
                    <Link to={`/meetings/${m._id}`} className="btn btn-small btn-primary" style={{ marginRight: '6px' }}>
                      View
                    </Link>
                    {user.role === 'admin' && (
                      <button className="btn btn-small btn-danger" onClick={() => handleDelete(m._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Meetings;
