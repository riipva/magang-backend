const express = require("express");
const ActivityLog = require("../models/ActivityLog");
const protect = require("../middleware/protect");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

// Semua route Activity Log wajib menggunakan token JWT
router.use(protect);

// GET: melihat riwayat aktivitas pengguna
router.get(
    "/",
    catchAsync(async (req, res) => {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const skip = (page - 1) * limit;

        const [activities, totalActivities] = await Promise.all([
            ActivityLog.find({ user: req.user._id })
                .populate("todo", "title")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            ActivityLog.countDocuments({ user: req.user._id })
        ]);

        res.status(200).json({
            status: "success",
            results: activities.length,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalActivities / limit),
                totalActivities,
                limit
            },
            data: {
                activities
            }
        });
    })
);

module.exports = router;
