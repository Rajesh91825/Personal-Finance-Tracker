// src/pages/Export.tsx
import React from "react";
import api from "../api/client";
import { toast } from "react-hot-toast";

const Export: React.FC = () => {
  const downloadFile = async (type: "csv" | "pdf") => {
    try {
      toast.loading("Preparing export...");
      const res = await api.get(`/export/${type}`, { responseType: "blob" });
      const blob = new Blob([res.data], { type: type === "csv" ? "text/csv" : "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ts = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.setAttribute("download", `transactions_${ts}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success("Export started");
    } catch {
      toast.dismiss();
      toast.error("Export failed");
    }
  };

  return (
    <div className="container">
      <div className="page-title"><span>📤</span><div>Export Transactions</div></div>
      <div className="card">
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-success" onClick={() => downloadFile("csv")}>Export CSV</button>
          <button className="btn btn-ghost" onClick={() => downloadFile("pdf")}>Export PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Export;
