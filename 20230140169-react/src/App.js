import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 text-center">
        <Link to="/login" className="mx-4 text-blue-600 hover:underline">Login</Link>
        <Link to="/register" className="mx-4 text-blue-600 hover:underline">Register</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
