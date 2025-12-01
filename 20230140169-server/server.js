const express = require('express');
const cors = require('cors');
const morgan = require("morgan");

const app = express();
const PORT = 5000;

// Import routes (pastikan nama file sesuai!)
const presensiRoutes = require('./routes/presensi'); // file: models/Presensi.js
const reportRoutes = require('./routes/reports');     // file: reportRoutes.js atau reports/index.js
const authRoutes = require('./routes/auth');
const authCountRoutes = require("./routes/authCount");


// Middleware utama
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Logger request manual (boleh tetap ada)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Home Page for API');
});

// Daftarkan semua routes ke API
app.use("/api/books", require("./routes/books")); // books route (aman karena inline-import langsung)
app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes); // ❗ FIX: sekarang variabel sudah benar
app.use("/api/auth", authCountRoutes);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
