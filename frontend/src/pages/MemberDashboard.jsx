import { useState, useEffect } from 'react';
import API from '../services/api';
import StatsCard from '../components/StatsCard';

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/dashboard/member');
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
      <h1 className="page-title">My Dashboard</h1>

      <div className="stats-grid">
        <StatsCard label="Total Tasks" value={data.totalTasks} />
        <StatsCard label="Completed" value={data.completedTasks} type="completed" />
        <StatsCard label="Pending" value={data.pendingTasks} />
        <StatsCard label="In Progress" value={data.inProgressTasks} />
        <StatsCard label="Overdue" value={data.overdueTasks} type="overdue" />
      </div>

      <h3 className="section-title">My Tasks</h3>
      {data.tasks.length === 0 ? (
        <p>No tasks assigned to you yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Meeting</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.meeting?.title || 'N/A'}</td>
                  <td>{new Date(t.deadline).toLocaleDateString()}</td>
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

export default MemberDashboard;
