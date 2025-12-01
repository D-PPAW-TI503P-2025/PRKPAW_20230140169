import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [lastAttendance, setLastAttendance] = useState(null);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Token rusak:", err);
      setError("Token tidak valid, silahkan login ulang.");
      handleLogout();
    }

    // Fetch data presensi terakhir untuk ditampilkan di dashboard
    const fetchLastAttendance = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/presensi/last", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLastAttendance(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLastAttendance();
  }, [token, navigate]);

  if (!user) {
    return <div className="text-center mt-10">Memuat dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl mt-10">

        {/* Card Profile */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md mb-3">{error}</div>
          )}
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Dashboard Presensi</h1>
          <p className="text-gray-600">Selamat datang kembali 👋</p>

          <div className="mt-4 space-y-1 text-gray-800">
            <p><strong>Nama:</strong> {user.nama}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white shadow"
          >
            Logout
          </button>
        </div>

        {/* Card Presensi Terakhir */}
        {lastAttendance && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Presensi Terakhir Anda</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-600 text-sm">
                    <th className="border p-2">Check-In</th>
                    <th className="border p-2">Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-800">
                    <td className="border p-2">
                      {new Date(lastAttendance.checkIn).toLocaleString("id-ID")}
                    </td>
                    <td className="border p-2">
                      {lastAttendance.checkOut
                        ? new Date(lastAttendance.checkOut).toLocaleString("id-ID")
                        : "Belum Check-Out"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
