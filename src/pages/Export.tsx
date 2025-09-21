import React from "react";
import "../styles.css";

const Export: React.FC = () => {
  const exportCSV = () => {
    alert("Export CSV triggered!");
  };
  const exportPDF = () => {
    alert("Export PDF triggered!");
  };

  return (
    <div className="page">
      <h2>⬇️ Export</h2>
      <div className="export-actions">
        <button className="btn-primary" onClick={exportCSV}>Export CSV</button>
        <button className="btn-secondary" onClick={exportPDF}>Export PDF</button>
      </div>
    </div>
  );
};

export default Export;
