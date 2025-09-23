import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl mb-4">404</h1>
    <p className="mb-6">Page not found</p>
    <Link to="/dashboard" className="text-blue-600">Go home</Link>
  </div>
);

export default NotFound;
