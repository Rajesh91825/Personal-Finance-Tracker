import React, { useEffect, useState } from "react";
import { summary, fetchTransactions, fetchCategories } from "../services/api";
import { rupee, dateOnly } from "../utils/format";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa46be", "#f54291"];

export default function Dashboard() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [totals, setTotals] = useState<{ total_spending?: string; per_category?: any[] }>({});
  const [recent, setRecent] = useState<any[]>([]);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const s = await summary("monthly");
      setTotals(s);
      const cats = s.per_category || [];
      setChartData((cats as any[]).map((c: any) => ({ name: c.category, value: Number(c.total) })));
      const tx = await fetchTransactions();
      setRecent(tx.slice(0, 5));
      const catList = await fetchCategories();
      setCategoriesCount(catList.length);
    } catch (err) {
      // ignore for now
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">📊 Dashboard</h1>

      <div className="grid-cards">
        <div className="card">
          <h4>Total Spending</h4>
          <div className="stat">{rupee(Number(totals.total_spending || 0))}</div>
        </div>
        <div className="card">
          <h4>Categories</h4>
          <div className="stat">{categoriesCount}</div>
        </div>
        <div className="card">
          <h4>Recent Transactions</h4>
          <div className="stat">{recent.length}</div>
        </div>
      </div>

      <div className="card chart-card">
        <h4>Spending by Category (Monthly)</h4>
        {chartData.length ? (
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="value" data={chartData} nameKey="name" outerRadius={120} label>
                  {chartData.map((_, idx: number) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>No data to show.</p>
        )}
      </div>

      <div className="card">
        <h4>Recent Transactions</h4>
        <ul>
          {recent.map((r: any) => (
            <li key={r.id}>
              {r.description} - {rupee(Number(r.amount))} - {dateOnly(r.transaction_date)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
