
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const logger = require("./middleware/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

const ActivityLog = require("./models/ActivityLog");

const protect = require("./middleware/protect");
const restrictTo = require("./middleware/restrictTo");
const catchAsync = require("./utils/catchAsync");

const app = express();

// Middleware utama
app.use(express.json());
app.use(logger);

// Dokumentasi Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Route utama
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Functional API berjalan."
    });
});

// Route autentikasi
app.use("/api/auth", authRoutes);

// Route Todo
app.use("/api/todos", todoRoutes);

// Route Category
app.use("/api/categories", categoryRoutes);

// Route Activity Log
app.get(
    "/api/activity-logs",
    protect,
    catchAsync(async (req, res) => {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const skip = (page - 1) * limit;

        const [activities, totalActivities] = await Promise.all([
            ActivityLog.find({
                user: req.user._id
            })
                .populate("todo", "title")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            ActivityLog.countDocuments({
                user: req.user._id
            })
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

// Route Statistics dengan API Key
app.use("/api/statistics", statisticsRoutes);

// Route untuk mengecek server
app.get("/api/todos/test", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Route Todo berhasil terdaftar."
    });
});

// Route yang membutuhkan token JWT
app.get("/api/protected", protect, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Token valid. Anda berhasil mengakses route ini.",
        data: {
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        }
    });
});

// Route khusus admin
app.get("/api/admin", protect, restrictTo("admin"), (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Akses admin berhasil."
    });
});

// Menangani route yang tidak ditemukan
app.use(notFound);

// Menangani error
app.use(errorHandler);

// Konfigurasi server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        if (
            !process.env.MONGODB_URI ||
            !process.env.JWT_SECRET ||
            !process.env.API_KEY
        ) {
            throw new Error(
                "MONGODB_URI, JWT_SECRET, dan API_KEY wajib diisi di file .env."
            );
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB berhasil terhubung.");

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Gagal menjalankan server:", error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
