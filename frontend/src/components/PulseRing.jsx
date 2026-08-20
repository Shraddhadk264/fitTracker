import "../styles/PulseRing.css";

const PulseRing = ({ percent = 0, size = 200, label, value, unit }) => {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="pulse-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(243,239,230,0.08)"
          strokeWidth={stroke}
        />
        <circle
          className="pulse-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#pulseGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ "--ring-offset": offset }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3ddc97" />
            <stop offset="100%" stopColor="#ff6b4a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pulse-ring-center">
        <span className="pulse-ring-value mono">
          {value}
          {unit && <small>{unit}</small>}
        </span>
        {label && <span className="pulse-ring-label">{label}</span>}
      </div>
    </div>
  );
};

export default PulseRing;
