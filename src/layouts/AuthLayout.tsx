import React from "react";
import "../styles.css";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="auth-layout">
      <main className="auth-content">{children}</main>
    </div>
  );
}
