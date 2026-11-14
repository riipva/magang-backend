
const express = require("express");

const Todo = require("../models/Todo");
const Category = require("../models/Category");
const User = require("../models/User");

const apiKeyAuth = require("../middleware/apiKeyAuth");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

// Semua endpoint statistik wajib menggunakan API Key
router.use(apiKeyAuth);

// GET: Statistik keseluruhan aplikasi
router.get(
    "/",
    catchAsync(async (req, res) => {
        const [
            totalUsers,
            totalTodos,
            completedTodos,
            pendingTodos,
            totalCategories
        ] = await Promise.all([
            User.countDocuments(),
            Todo.countDocuments(),
            Todo.countDocuments({ completed: true }),
            Todo.countDocuments({ completed: false }),
            Category.countDocuments()
        ]);

        res.status(200).json({
            status: "success",
            message: "Statistik berhasil diambil.",
            data: {
                users: {
                    total: totalUsers
                },
                todos: {
                    total: totalTodos,
                    completed: completedTodos,
                    pending: pendingTodos
                },
                categories: {
                    total: totalCategories
                }
            }
        });
    })
);

module.exports = router;
