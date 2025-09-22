import React, { useEffect, useState } from "react";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { rupee } from "../helpers/format";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa46be", "#f54291"];

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transactions/summary?period=monthly");
        setSummary(res.data);
      } catch {
        toast.error("Failed to load summary ❌");
      }

      try {
        const res2 = await api.get("/transactions");
        const sorted = (res2.data || []).sort(
          (a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
        );
        setRecent(sorted.slice(0, 5));
      } catch {
        toast.error("Failed to load recent transactions ❌");
      }
    };
    fetchData();
  }, []);

  const chartData =
    summary?.per_category?.map((c: any) => ({
      name: c.category,
      value: parseFloat(c.total),
    })) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Total Spending</h3>
          <p className="text-xl">{rupee(Number(summary?.total_spending || 0))}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Categories</h3>
          <p className="text-xl">{summary?.per_category?.length || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Transactions</h3>
          <p className="text-xl">{recent.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Spending by Category</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={chartData}
                  outerRadius={120}
                  label={({ name }) => name}
                >
                  {chartData.map((_: any, idx: number) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any, _: any, entry: any) => `${entry.name}: ${rupee(val)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No data</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recent Transactions</h3>
          {recent.length > 0 ? (
            <ul>
              {recent.map((t) => (
                <li key={t.id} className="border-b py-1">
                  {t.description} - {rupee(Number(t.amount))}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
