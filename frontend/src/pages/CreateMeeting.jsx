import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateMeeting = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState(['']);
  const [decisions, setDecisions] = useState(['']);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleAddActionItem = () => {
    setActionItems([...actionItems, '']);
  };

  const handleRemoveActionItem = (index) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const handleActionItemChange = (index, value) => {
    const updated = [...actionItems];
    updated[index] = value;
    setActionItems(updated);
  };

  const handleAddDecision = () => {
    setDecisions([...decisions, '']);
  };

  const handleRemoveDecision = (index) => {
    setDecisions(decisions.filter((_, i) => i !== index));
  };

  const handleDecisionChange = (index, value) => {
    const updated = [...decisions];
    updated[index] = value;
    setDecisions(updated);
  };

  const handleAttendeeToggle = (userId) => {
    if (attendees.includes(userId)) {
      setAttendees(attendees.filter((id) => id !== userId));
    } else {
      setAttendees([...attendees, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const filteredActions = actionItems
      .filter((item) => item.trim() !== '')
      .map((text) => ({ text }));

    const filteredDecisions = decisions
      .filter((item) => item.trim() !== '')
      .map((text) => ({ text }));

    try {
      await API.post('/meetings', {
        title,
        date,
        attendees,
        notes,
        actionItems: filteredActions,
        decisions: filteredDecisions,
      });
      navigate('/meetings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Create Meeting</h1>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Attendees</label>
            <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
              {users.map((u) => (
                <label key={u._id} style={{ display: 'block', marginBottom: '4px', fontWeight: 'normal', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={attendees.includes(u._id)}
                    onChange={() => handleAttendeeToggle(u._id)}
                    style={{ marginRight: '8px' }}
                  />
                  {u.name} ({u.email})
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="General meeting notes..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Action Items</label>
            <div className="dynamic-list">
              {actionItems.map((item, index) => (
                <div className="list-item" key={index}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleActionItemChange(index, e.target.value)}
                    placeholder={`Action item ${index + 1}`}
                  />
                  {actionItems.length > 1 && (
                    <button type="button" onClick={() => handleRemoveActionItem(index)}>X</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-small btn-primary" onClick={handleAddActionItem}>
                + Add Action Item
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Decisions</label>
            <div className="dynamic-list">
              {decisions.map((item, index) => (
                <div className="list-item" key={index}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleDecisionChange(index, e.target.value)}
                    placeholder={`Decision ${index + 1}`}
                  />
                  {decisions.length > 1 && (
                    <button type="button" onClick={() => handleRemoveDecision(index)}>X</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-small btn-primary" onClick={handleAddDecision}>
                + Add Decision
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Create Meeting</button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;
