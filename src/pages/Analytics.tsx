import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

type DataItem = { name: string; value: number };

const COLORS = ["#2F80ED", "#27AE60", "#F2C94C", "#EB5757", "#9B51E0"];

const data: DataItem[] = [
  { name: "Transport", value: 750 },
  { name: "Food", value: 651.25 },
  { name: "Rent", value: 240 },
  { name: "Entertainment", value: 200 },
  { name: "Utilities", value: 130 },
];

const Analytics: React.FC = () => {
  return (
    <div>
      <h2 className="page-title">Analytics</h2>
      <div className="card">
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(props) => `${props.name} (${Math.round(props.value as number)})`}
              >
                {data.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `₹ ${val.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
