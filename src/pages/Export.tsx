import React from "react";
import api from "../api/client";

const ExportPage: React.FC = () => {
  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const res = await api.get(`/export/${format}`, { responseType: "blob" });

      const now = new Date();
      const timestamp = now
        .toISOString()
        .replace("T", "_") 
        .replace(/:/g, "-")
        .split(".")[0]; 

      const filename = `transactions_${timestamp}.${format}`;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to export file");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">📤 Export Transactions</h2>

      <div className="bg-white p-6 rounded shadow max-w-xl">
        <p className="mb-4 text-gray-700">
          Download your transactions in different formats:
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
