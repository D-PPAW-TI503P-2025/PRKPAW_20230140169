const express = require("express");
const router = express.Router();
const db = require("../models");
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

// Endpoint hitung total user (admin only)
router.get("/count", authenticateToken, isAdmin, async (req, res) => {
  const count = await db.User.count();
  res.json({ count });
});

module.exports = router;
