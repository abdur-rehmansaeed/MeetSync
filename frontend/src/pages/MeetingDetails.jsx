import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  // Edit state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await API.get(`/meetings/${id}`);
        setMeeting(res.data);
        setTitle(res.data.title);
        setDate(res.data.date?.substring(0, 10));
        setNotes(res.data.notes || '');
        setActionItems(res.data.actionItems?.map((a) => a.text) || []);
        setDecisions(res.data.decisions?.map((d) => d.text) || []);
      } catch (err) {
        setError('Failed to load meeting');
      }
      setLoading(false);
    };
    fetchMeeting();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await API.put(`/meetings/${id}`, {
        title,
        date,
        notes,
        actionItems: actionItems.filter((a) => a.trim()).map((text) => ({ text })),
        decisions: decisions.filter((d) => d.trim()).map((text) => ({ text })),
      });
      setMeeting(res.data);
      setEditing(false);
    } catch (err) {
      setError('Failed to update meeting');
    }
  };

  if (loading) return <div className="loading">Loading meeting...</div>;
  if (error) return <div className="page-container"><div className="error-msg">{error}</div></div>;
  if (!meeting) return <div className="page-container"><p>Meeting not found.</p></div>;

  return (
    <div className="page-container">
      <div className="flex-between">
        <h1 className="page-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          Meeting Details
        </h1>
        <div>
          {user.role === 'admin' && !editing && (
            <button className="btn btn-primary btn-small" onClick={() => setEditing(true)} style={{ marginRight: '8px' }}>
              Edit
            </button>
          )}
          <button className="btn btn-small" onClick={() => navigate('/meetings')} style={{ background: '#95a5a6', color: 'white' }}>
            Back
          </button>
        </div>
      </div>

      <div className="card">
        {editing ? (
          <>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            </div>
            <div className="form-group">
              <label>Action Items</label>
              <div className="dynamic-list">
                {actionItems.map((item, i) => (
                  <div className="list-item" key={i}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...actionItems];
                        updated[i] = e.target.value;
                        setActionItems(updated);
                      }}
                    />
                    <button type="button" onClick={() => setActionItems(actionItems.filter((_, idx) => idx !== i))}>X</button>
                  </div>
                ))}
                <button type="button" className="btn btn-small btn-primary" onClick={() => setActionItems([...actionItems, ''])}>
                  + Add
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Decisions</label>
              <div className="dynamic-list">
                {decisions.map((item, i) => (
                  <div className="list-item" key={i}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...decisions];
                        updated[i] = e.target.value;
                        setDecisions(updated);
                      }}
                    />
                    <button type="button" onClick={() => setDecisions(decisions.filter((_, idx) => idx !== i))}>X</button>
                  </div>
                ))}
                <button type="button" className="btn btn-small btn-primary" onClick={() => setDecisions([...decisions, ''])}>
                  + Add
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-success" onClick={handleSave}>Save</button>
              <button className="btn" onClick={() => setEditing(false)} style={{ background: '#95a5a6', color: 'white' }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h3>{meeting.title}</h3>
            <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
            <p><strong>Created By:</strong> {meeting.createdBy?.name || 'N/A'}</p>

            <div className="detail-section">
              <h4>Attendees</h4>
              {meeting.attendees?.length > 0 ? (
                <ul>
                  {meeting.attendees.map((a) => (
                    <li key={a._id}>{a.name} ({a.email})</li>
                  ))}
                </ul>
              ) : (
                <p>No attendees recorded.</p>
              )}
            </div>

            <div className="detail-section">
              <h4>Notes</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{meeting.notes || 'No notes.'}</p>
            </div>

            <div className="detail-section">
              <h4>Action Items</h4>
              {meeting.actionItems?.length > 0 ? (
                <ul>
                  {meeting.actionItems.map((item, i) => (
                    <li key={i}>{item.text}</li>
                  ))}
                </ul>
              ) : (
                <p>No action items.</p>
              )}
            </div>

            <div className="detail-section">
              <h4>Decisions</h4>
              {meeting.decisions?.length > 0 ? (
                <ul>
                  {meeting.decisions.map((item, i) => (
                    <li key={i}>{item.text}</li>
                  ))}
                </ul>
              ) : (
                <p>No decisions.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MeetingDetails;
