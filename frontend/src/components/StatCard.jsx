import "../styles/StatCard.css";

const StatCard = ({ icon: Icon, label, value, unit, accent = "pulse", trend }) => {
  return (
    <div className={`stat-card glass accent-${accent}`}>
      <div className="stat-card-top">
        <span className="stat-icon">
          <Icon size={18} strokeWidth={2} />
        </span>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
      <p className="stat-value mono">
        {value}
        {unit && <small>{unit}</small>}
      </p>
      <p className="stat-label">{label}</p>
    </div>
  );
};

export default StatCard;
