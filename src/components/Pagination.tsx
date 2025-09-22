import React from "react";
import "../styles.css";

type Props = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
};

const Pagination: React.FC<Props> = ({ total, page, pageSize, onPageChange }) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const arr = [];
  for (let i = 1; i <= pages; i++) arr.push(i);
  return (
    <div className="pagination">
      <button className="btn-ghost" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
      {arr.map((p) => (
        <button key={p} className={p === page ? "btn-ghost active" : "btn-ghost"} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      <button className="btn-ghost" disabled={page === pages} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  );
};

export default Pagination;
