const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

const {  authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

router.use(authenticateToken);

// ✅ FIX PENTING: `authenticateToken` harus dipanggil *sebelum* `isAdmin`
router.get("/daily", authenticateToken, isAdmin, reportController.getDailyReport);

module.exports = router;
