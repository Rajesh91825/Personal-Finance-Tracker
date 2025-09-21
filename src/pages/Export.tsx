import React, { useState } from "react";
import api from "../api/client";
import "../styles.css";

const Export: React.FC = () => {
  const [lastExport, setLastExport] = useState<string | null>(null);

  const downloadFile = async (type: "csv" | "pdf") => {
    try {
      const res = await api.get(`/export/${type}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLastExport(new Date().toLocaleString());
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="page">
      <h2>⬇️ Export Transactions</h2>
      <div className="export-cards">
        <div className="export-card">
          <h3>📄 Export CSV</h3>
          <p>Download your transactions in CSV format.</p>
          <button className="btn-primary" onClick={() => downloadFile("csv")}>
            Download CSV
          </button>
        </div>
        <div className="export-card">
          <h3>📑 Export PDF</h3>
          <p>Download your transactions in PDF format.</p>
          <button className="btn-secondary" onClick={() => downloadFile("pdf")}>
            Download PDF
          </button>
        </div>
      </div>
      {lastExport && <p className="last-export">Last export: {lastExport}</p>}
    </div>
  );
};

export default Export;
