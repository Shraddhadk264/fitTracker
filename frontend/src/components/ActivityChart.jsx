import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../styles/ActivityChart.css";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-day">{label}</p>
      <p className="chart-tooltip-value mono">{payload[0].value} min</p>
    </div>
  );
};

const ActivityChart = ({ activityByDay = [0, 0, 0, 0, 0, 0, 0] }) => {
  const data = DAY_LABELS.map((day, i) => ({
    day,
    minutes: activityByDay[i] || 0,
  }));

  const todayIndex = new Date().getDay();

  return (
    <div className="activity-chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="28%">
          <CartesianGrid
            vertical={false}
            stroke="rgba(243,239,230,0.08)"
            strokeDasharray="4 6"
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "#8fb3a6", fontSize: 12, fontFamily: "Inter" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(243,239,230,0.05)" }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="minutes" radius={[8, 8, 8, 8]} maxBarSize={28}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === todayIndex
                    ? "url(#activeBarGradient)"
                    : "url(#barGradient)"
                }
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2ba876" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#2ba876" stopOpacity={0.15} />
            </linearGradient>
            <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3ddc97" />
              <stop offset="100%" stopColor="#ff6b4a" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
