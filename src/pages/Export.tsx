import React from "react";
import { exportCsv, exportPdf } from "../services/api";
import toast from "react-hot-toast";

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

export default function ExportPage() {
  async function handleCSV() {
    try {
      const blob = await exportCsv();
      saveBlob(blob, "transactions.csv");
      toast.success("CSV downloaded");
    } catch (err:any) {
      toast.error(err?.response?.data?.message || "Export error");
    }
  }

  async function handlePDF() {
    try {
      const blob = await exportPdf();
      saveBlob(blob, "transactions.pdf");
      toast.success("PDF downloaded");
    } catch (err:any) {
      toast.error(err?.response?.data?.message || "Export error");
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">⬇️ Export Transactions</h1>
      <div className="card">
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn success" onClick={handleCSV}>Export CSV</button>
          <button className="btn primary-outline" onClick={handlePDF}>Export PDF</button>
        </div>
      </div>
    </div>
  );
}
