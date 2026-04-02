import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatsCard from '../components/StatsCard';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/dashboard/admin');
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard');
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="page-container"><div className="error-msg">{error}</div></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="stats-grid">
        <StatsCard label="Total Meetings" value={data.totalMeetings} />
        <StatsCard label="Total Tasks" value={data.totalTasks} />
        <StatsCard label="Completed" value={data.completedTasks} type="completed" />
        <StatsCard label="Pending" value={data.pendingTasks} />
        <StatsCard label="In Progress" value={data.inProgressTasks} />
        <StatsCard label="Overdue" value={data.overdueTasks} type="overdue" />
      </div>

      <h3 className="section-title">Recent Meetings</h3>
      {data.recentMeetings.length === 0 ? (
        <p>No meetings yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {data.recentMeetings.map((m) => (
                <tr key={m._id}>
                  <td><Link to={`/meetings/${m._id}`}>{m.title}</Link></td>
                  <td>{new Date(m.date).toLocaleDateString()}</td>
                  <td>{m.createdBy?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="section-title">Recent Tasks</h3>
      {data.recentTasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Meeting</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.assignedTo?.name || 'N/A'}</td>
                  <td>{t.meeting?.title || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${t.status.toLowerCase().replace(' ', '')}`}>
                      {t.status}
                    </span>
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

export default AdminDashboard;
