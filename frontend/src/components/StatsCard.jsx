const StatsCard = ({ label, value, type }) => {
  let className = 'stat-card';
  if (type === 'overdue') className += ' overdue';
  if (type === 'completed') className += ' completed';

  return (
    <div className={className}>
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatsCard;