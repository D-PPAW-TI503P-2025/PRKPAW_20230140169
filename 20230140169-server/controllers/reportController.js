const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { tanggal, nama } = req.query; // Ambil query parameter
    let options = { where: {} };

    //  Jika parameter tanggal diisi, filter berdasarkan tanggal itu
    if (tanggal) {
      const startDate = new Date(`${tanggal}T00:00:00.000Z`);
      const endDate = new Date(`${tanggal}T23:59:59.999Z`);
      options.where.checkIn = {
        [Op.between]: [startDate, endDate],
      };
    }

    //  Jika parameter nama diisi, filter berdasarkan nama
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    //  Ambil data dari database
    const records = await Presensi.findAll({
      ...options,
      order: [["checkIn", "ASC"]],
    });

    //  Format tanggal laporan (kalau tidak ada tanggal, tulis "Semua Tanggal")
    const reportDate = tanggal
      ? tanggal.split("-").reverse().join("/")
      : "Semua Tanggal";

    res.json({
      reportDate,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
