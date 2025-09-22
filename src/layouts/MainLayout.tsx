import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles.css";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-container">{children}</div>
      </div>
    </div>
  );
}
