const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

// jangan include isAdmin di sini, hanya untuk admin statistik/laporan
router.use(authenticateToken);

router.post("/check-in", authenticateToken, presensiController.checkIn);
router.post("/check-out", authenticateToken, presensiController.checkOut);

// ❗ Wajib pakai handler function, tidak boleh undefined
router.put("/:id", authenticateToken, presensiController.updatePresensi);
router.delete("/:id", authenticateToken, presensiController.deletePresensi);

// statistik admin → memanggil function count dari controller
router.get("/today-count", authenticateToken, isAdmin, async (req, res) => {
  try {
    const count = await presensiController.getTodayCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Gagal hitung presensi", error: err.message });
  }
});

module.exports = router;
