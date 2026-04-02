import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import StatsCard from "../components/StatsCard";

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalMeetings: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    recentMeetings: [],
    recentTasks: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");

        // fallback-safe structure
        const d = res.data || {};

        setData({
          totalUsers: d.totalUsers || 0,
          totalMeetings: d.totalMeetings || 0,
          totalTasks: d.totalTasks || 0,

          // these don’t exist in API → safe defaults
          completedTasks: d.completedTasks || 0,
          pendingTasks: d.pendingTasks || 0,
          inProgressTasks: d.inProgressTasks || 0,
          overdueTasks: d.overdueTasks || 0,

          // IMPORTANT: always arrays
          recentMeetings: d.recentMeetings || [],
          recentTasks: d.recentTasks || [],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      }

      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  if (error)
    return (
      <div className="page-container">
        <div className="error-msg">{error}</div>
      </div>
    );

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="stats-grid">
        <StatsCard label="Total Meetings" value={data.totalMeetings} />
        <StatsCard label="Total Tasks" value={data.totalTasks} />
        <StatsCard label="Completed" value={data.completedTasks} />
        <StatsCard label="Pending" value={data.pendingTasks} />
        <StatsCard label="In Progress" value={data.inProgressTasks} />
        <StatsCard label="Overdue" value={data.overdueTasks} />
      </div>

      {/* ===================== MEETINGS ===================== */}
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
              {data.recentMeetings.map((m, i) => (
                <tr key={i}>
                  <td>
                    <Link to={`/meetings/${m.id || i}`}>
                      {m.title || "Untitled"}
                    </Link>
                  </td>
                  <td>
                    {m.date
                      ? new Date(m.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{m.createdBy || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== TASKS ===================== */}
      <h3 className="section-title">Recent Tasks</h3>

      {data.recentTasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTasks.map((t, i) => (
                <tr key={i}>
                  <td>{t.title || "Untitled"}</td>
                  <td>{t.status || "N/A"}</td>
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