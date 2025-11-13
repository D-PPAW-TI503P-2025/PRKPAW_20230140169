import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaFileAlt, FaCog, FaSeedling } from "react-icons/fa";

function DashboardPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userNama = localStorage.getItem("nama");

    if (!token) {
      navigate("/login");
    } else {
      setNama(userNama || "Pengguna");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nama");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-green-200">
      {/* Navbar */}
      <header className="flex justify-between items-center bg-white shadow-md p-4 px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <FaSeedling className="text-green-600 text-2xl" />
          <h1 className="text-2xl font-extrabold text-green-700 tracking-wide">
            Smart Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-gray-700 font-medium italic">
            Hi, <span className="font-semibold text-green-700">{nama}</span> 👋
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-20 text-center px-4"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4"
        >
          Selamat Datang, {nama}! 🌱
        </motion.h2>

        <p className="text-gray-700 mb-10 max-w-2xl text-lg leading-relaxed">
          Kamu sekarang berada di <strong>Smart Dashboard</strong> — pusat
          kendali untuk mengelola data, melihat laporan, dan mengatur sistem
          dengan mudah & efisien.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            {
              icon: <FaUserGraduate className="text-green-500 text-5xl mb-3" />,
              title: "Data Mahasiswa",
              desc: "Lihat dan kelola seluruh data mahasiswa.",
              color: "from-green-400 to-green-600",
            },
            {
              icon: <FaFileAlt className="text-green-500 text-5xl mb-3" />,
              title: "Laporan",
              desc: "Pantau hasil laporan mingguan secara interaktif.",
              color: "from-emerald-400 to-emerald-600",
            },
            {
              icon: <FaCog className="text-green-500 text-5xl mb-3" />,
              title: "Pengaturan",
              desc: "Ubah preferensi akun & sistem sesuai kebutuhanmu.",
              color: "from-lime-400 to-lime-600",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl`}
            >
              {card.icon}
              <h3 className="font-bold text-green-700 text-xl mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 text-sm">
        © {new Date().getFullYear()} Smart Dashboard — dibuat dengan 🌿 oleh Timmu.
      </footer>
    </div>
  );
}

export default DashboardPage;
