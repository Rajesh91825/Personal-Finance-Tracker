// src/pages/Export.tsx
import React from "react";
import api from "../api/client";

function downloadBlob(data: Blob, filename: string) {
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const ExportPage: React.FC = () => {
  const handleCSV = async () => {
    try {
      const res = await api.get("/export/csv", { responseType: "blob" });
      downloadBlob(res.data, "transactions.csv");
    } catch {
      alert("Export CSV failed");
    }
  };

  const handlePDF = async () => {
    try {
      const res = await api.get("/export/pdf", { responseType: "blob" });
      downloadBlob(res.data, "transactions.pdf");
    } catch {
      alert("Export PDF failed");
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h1 className="text-xl mb-4">Export</h1>
      <div className="flex flex-col gap-3">
        <button onClick={handleCSV} className="px-4 py-2 bg-blue-600 text-white rounded">Download CSV</button>
        <button onClick={handlePDF} className="px-4 py-2 bg-slate-700 text-white rounded">Download PDF</button>
      </div>
    </div>
  );
};

export default ExportPage;
