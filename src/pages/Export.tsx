import React from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function saveBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default function Export() {
  const handleExportCsv = async () => {
    try {
      const res = await api.get("/export/csv", { responseType: "blob" });
      saveBlob(res.data, "transactions.csv");
      toast.success("CSV exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV");
    }
  };

  const handleExportPdf = async () => {
    try {
      const res = await api.get("/export/pdf", { responseType: "blob" });
      saveBlob(res.data, "transactions.pdf");
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="card">
      <h2>Export Transactions</h2>
      <p>Download your transactions in different formats:</p>
      <div className="flex gap">
        <button className="btn primary" onClick={handleExportCsv}>
          Export CSV
        </button>
        <button className="btn success" onClick={handleExportPdf}>
          Export PDF
        </button>
      </div>
    </div>
  );
}
