import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function DashboardAdminPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [todayCount, setTodayCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!token) return navigate("/login", { replace: true });

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        // ❗ Kalau bukan admin, tampilkan error tapi jangan crash
        setError("Anda login sebagai user biasa, bukan admin.");
        setUser(decoded);
        return;
      }
      setUser(decoded);
    } catch {
      handleLogout();
    }

    const fetchStats = async () => {
      try {
        const u = await axios.get("/api/auth/count", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserCount(u.data.count);

        const p = await axios.get("/api/presensi/today-count", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTodayCount(p.data.count);

      } catch {
        setError("Gagal mengambil statistik admin.");
      }
    };

    fetchStats();
  }, [token]);

  if (!user) return <p className="text-center mt-10">Memuat...</p>;

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="bg-white p-6 mt-10 rounded-xl shadow w-full max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-3">Dashboard Admin</h1>
        <p>Halo, {user.nama}</p>
        <p className="text-sm text-gray-600">{user.email}</p>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded mt-3">{error}</p>}

        {user.role === "admin" && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">Total User</h2>
              <p className="text-3xl font-bold mt-2">{userCount}</p>
            </div>

            <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">Total Presensi Hari Ini</h2>
              <p className="text-3xl font-bold mt-2">{todayAttendance}</p>
            </div>
          </div>
        )}

        <div className="space-x-4 mt-8">
          <Link to="/reports">
            <button className="px-4 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-900">
              Lihat Laporan
            </button>
          </Link>

          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdminPage;
