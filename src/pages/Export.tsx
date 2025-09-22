import React, { useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";
import "../styles.css";

const Export: React.FC = () => {
  const [lastExport, setLastExport] = useState<string | null>(null);

  const download = async (type: "csv" | "pdf") => {
    try {
      const res = await api.get(`/export/${type}`, { responseType: "blob" });
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `transactions_${timestamp}.${type}`;
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLastExport(new Date().toLocaleString());
      toast.success(`Downloaded ${filename}`);
    } catch (err: any) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  return (
    <div className="page">
      <h2>⬇️ Export Transactions</h2>
      <div className="export-cards">
        <div className="export-card">
          <h3>📄 Export CSV</h3>
          <p>Download your transactions in CSV format.</p>
          <button className="btn-primary" onClick={() => download("csv")}>Download CSV</button>
        </div>
        <div className="export-card">
          <h3>📑 Export PDF</h3>
          <p>Download your transactions in PDF format.</p>
          <button className="btn-secondary" onClick={() => download("pdf")}>Download PDF</button>
        </div>
      </div>
      {lastExport && <div style={{ marginTop: 12 }} className="muted">Last export: {lastExport}</div>}
    </div>
  );
};

export default Export;
