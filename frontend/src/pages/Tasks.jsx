import { useState, useEffect } from 'react';
import API from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meeting, setMeeting] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');

  const fetchData = async () => {
    try {
      const [tasksRes, meetingsRes, usersRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/meetings'),
        API.get('/users'),
      ]);
      setTasks(tasksRes.data);
      setMeetings(meetingsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/tasks', { title, description, meeting, assignedTo, deadline });
      setTitle('');
      setDescription('');
      setMeeting('');
      setAssignedTo('');
      setDeadline('');
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const isOverdue = (task) => {
    return new Date(task.deadline) < new Date() && task.status !== 'Completed';
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="page-container">
      <div className="flex-between">
        <h1 className="page-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>All Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="card mb-20">
          <h3 style={{ marginBottom: '12px' }}>Create New Task</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description (optional)" />
            </div>
            <div className="form-group">
              <label>Related Meeting</label>
              <select value={meeting} onChange={(e) => setMeeting(e.target.value)} required>
                <option value="">-- Select Meeting --</option>
                {meetings.map((m) => (
                  <option key={m._id} value={m._id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Assign To</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-success">Create Task</button>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Meeting</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.assignedTo?.name || 'N/A'}</td>
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
                  <td>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(t._id)}>
                      Delete
                    </button>
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

export default Tasks;
