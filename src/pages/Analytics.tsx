import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { rupee } from "../utils/format";
import "../styles.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa46be", "#f54291"];

type ChartItem = { name: string; value: number };

export default function Analytics() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/transactions/summary?period=monthly");
        const categories = res.data?.per_category || [];
        const mapped: ChartItem[] = categories.map((c: any) => ({
          name: c.category,
          value: Number(c.total) || 0,
        }));
        setChartData(mapped);
        setTotal(Number(res.data?.total_spending) || 0);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load analytics");
      }
    }
    load();
  }, []);

  const renderLabel = (props: PieLabelRenderProps) => {
    const idx = props.index as number;
    return chartData[idx] ? chartData[idx].name : "";
  };

  return (
    <div className="page analytics-page">
      <h2>📈 Analytics</h2>
      <div className="card">
        <h3>Total Spending: {rupee(total)}</h3>
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={chartData}
                nameKey="name"
                outerRadius={120}
                label={renderLabel}
                labelLine={false}
              >
                {chartData.map((_, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => rupee(Number(val))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h4>⚠️ Unusual Transactions</h4>
        <UnusualTransactions />
      </div>
    </div>
  );
}

function UnusualTransactions() {
  const [multiplier, setMultiplier] = useState<number>(2);
  const [results, setResults] = useState<any[]>([]);

  const fetchUnusual = async () => {
    try {
      const res = await api.get(
        `/transactions/unusual?period=monthly&multiplier=${multiplier}`
      );
      setResults(res.data?.unusual_transactions || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch unusual transactions");
    }
  };

  return (
    <div>
      <label>
        Multiplier{" "}
        <input
          type="number"
          value={multiplier}
          onChange={(e) => setMultiplier(Number(e.target.value))}
          min={1}
        />
      </label>{" "}
      <button className="btn primary" onClick={fetchUnusual}>
        Apply
      </button>

      <div style={{ marginTop: 12 }}>
        {results.length === 0 ? (
          <div>No unusual transactions found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.description}</td>
                  <td>{rupee(Number(r.amount))}</td>
                  <td>{new Date(r.transaction_date).toISOString().slice(0, 10)}</td>
                  <td>{r.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
