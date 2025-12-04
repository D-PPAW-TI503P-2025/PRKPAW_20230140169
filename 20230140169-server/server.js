const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const path = require("path");  // <-- WAJIB

const app = express();
const PORT = 5000;

// Middleware utama
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// =============================
//     FIX PALING PENTING !!!
// =============================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Sekarang: http://localhost:5000/uploads/nama-file.jpg akan BERFUNGSI
// =============================

// Logger manual
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/presensi", require("./routes/presensi"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/auth", require("./routes/authCount"));

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
