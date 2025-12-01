const db = require("../models");
const Presensi = db.Presensi;
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const { Op } = require("sequelize");

exports.checkIn = async (req, res) => {
  try {
    console.log("Payload token:", req.user); // debug isi token

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Token invalid." });
    }

    const userId = req.user.id;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body; // <-- Ambil data lokasi

    // ✅ FIX FILTER KE KOLOM YANG BENAR (Sequelize case-sensitive)
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
      order: [["checkIn", "DESC"]],
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude, // <-- Simpan ke database
      longitude: longitude, // <-- Simpan ke database

    });

    res.status(201).json({
      message: `Halo ${req.user.nama}, check-in Anda berhasil`,
      data: {
        id: newRecord.id,
        nama: newRecord.nama || req.user.nama,
        checkIn: format(waktuSekarang, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    console.log("Payload token:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Token invalid." });
    }

    const userId = req.user.id;
    const waktuSekarang = new Date();

    const record = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
      order: [["checkIn", "DESC"]],
    });

    if (!record) {
      return res.status(404).json({ message: "Belum ada check-in aktif." });
    }

    record.checkOut = waktuSekarang;
    await record.save();

    res.json({
      message: `Selamat jalan ${req.user.nama}, check-out berhasil`,
      data: {
        id: record.id,
        nama: record.nama || req.user.nama,
        checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(waktuSekarang, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Tambah Update Presensi
exports.updatePresensi = async (req, res) => {
  try {
    const id = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    const record = await Presensi.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Presensi tidak ditemukan" });
    }

    if (nama) record.nama = nama;
    if (checkIn) record.checkIn = new Date(checkIn);
    if (checkOut) record.checkOut = new Date(checkOut);

    await record.save();
    res.json({ message: "Data presensi berhasil diupdate", data: record });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Tambah Delete Presensi
exports.deletePresensi = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Presensi.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Presensi tidak ditemukan" });
    }

    await record.destroy();
    res.json({ message: "Data presensi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ FIX: ini **bukan route handler**, cukup return angka saja
exports.getTodayCount = async () => {
  const today = new Date();
  const start = new Date(today.setHours(0,0,0,0));
  const end = new Date(today.setHours(23,59,59,999));

  const count = await Presensi.count({
    where: { checkIn: { [Op.between]: [start, end] } }
  });

  return count;
};
