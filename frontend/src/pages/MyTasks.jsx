import { useState, useEffect } from 'react';
import API from '../services/api';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const isOverdue = (task) => {
    return new Date(task.deadline) < new Date() && task.status !== 'Completed';
  };

  if (loading) return <div className="loading">Loading your tasks...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">My Tasks</h1>

      {error && <div className="error-msg">{error}</div>}

      {tasks.length === 0 ? (
        <p>You have no tasks assigned.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Meeting</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.description || '-'}</td>
                  <td>{t.meeting?.title || 'N/A'}</td>
                  <td style={{ color: isOverdue(t) ? '#e74c3c' : 'inherit', fontWeight: isOverdue(t) ? 'bold' : 'normal' }}>
                    {new Date(t.deadline).toLocaleDateString()}
                    {isOverdue(t) && ' (overdue)'}
                  </td>
                  <td>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t._id, e.target.value)}
                      style={{ padding: '4px', fontSize: '13px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
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

export default MyTasks;
