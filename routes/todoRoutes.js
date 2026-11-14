
const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");
const Category = require("../models/Category");
const ActivityLog = require("../models/ActivityLog");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const protect = require("../middleware/protect");

const {
    createTodoValidator,
    updateTodoValidator,
    todoIdValidator,
    todoQueryValidator
} = require("../validators/todoValidator");

const router = express.Router();

router.use(protect);

// CREATE TODO
router.post(
    "/",
    createTodoValidator,
    catchAsync(async (req, res, next) => {
        const { title, description, completed, category } = req.body;

        if (category) {
            const foundCategory = await Category.findOne({
                _id: category,
                user: req.user._id
            });

            if (!foundCategory) {
                return next(new AppError("Kategori tidak ditemukan.", 404));
            }
        }

        const todo = await Todo.create({
            title: title.trim(),
            description: description || "",
            completed: completed ?? false,
            category: category || null,
            user: req.user._id
        });

        await ActivityLog.create({
            user: req.user._id,
            todo: todo._id,
            action: "CREATE",
            details: `Membuat Todo: ${todo.title}`
        });

        res.status(201).json({
            status: "success",
            message: "Todo berhasil ditambahkan.",
            data: { todo }
        });
    })
);

// READ ALL TODO + PAGINATION + FILTER + SEARCH + SORTING
router.get(
    "/",
    todoQueryValidator,
    catchAsync(async (req, res) => {
        const {
            page = 1,
            limit = 10,
            completed,
            category,
            search,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const filter = {
            user: req.user._id
        };

        if (completed !== undefined) {
            filter.completed = completed === "true";
        }

        if (category !== undefined) {
            filter.category = category === "null" ? null : category;
        }

        if (search && search.trim()) {
            const keyword = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        const sortOption = {
            [sortBy]: order === "asc" ? 1 : -1
        };

        const skip = (pageNumber - 1) * limitNumber;

        const [todos, totalTodos] = await Promise.all([
            Todo.find(filter)
                .populate("category", "name description")
                .sort(sortOption)
                .skip(skip)
                .limit(limitNumber),

            Todo.countDocuments(filter)
        ]);

        res.status(200).json({
            status: "success",
            results: todos.length,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalTodos / limitNumber),
                totalTodos,
                limit: limitNumber
            },
            filters: {
                completed: completed ?? null,
                category: category ?? null,
                search: search ?? null,
                sortBy,
                order
            },
            data: { todos }
        });
    })
);

// READ ONE TODO
router.get(
    "/:id",
    todoIdValidator,
    catchAsync(async (req, res, next) => {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("category", "name description");

        if (!todo) {
            return next(new AppError("Todo tidak ditemukan.", 404));
        }

        res.status(200).json({
            status: "success",
            data: { todo }
        });
    })
);

// UPDATE TODO
router.patch(
    "/:id",
    updateTodoValidator,
    catchAsync(async (req, res, next) => {
        const { title, description, completed, category } = req.body;
        const updates = {};

        if (title !== undefined) {
            updates.title = title.trim();
        }

        if (description !== undefined) {
            updates.description = description;
        }

        if (completed !== undefined) {
            updates.completed = completed;
        }

        if (category !== undefined) {
            if (category === null || category === "") {
                updates.category = null;
            } else {
                const foundCategory = await Category.findOne({
                    _id: category,
                    user: req.user._id
                });

                if (!foundCategory) {
                    return next(new AppError("Kategori tidak ditemukan.", 404));
                }

                updates.category = category;
            }
        }

        if (Object.keys(updates).length === 0) {
            return next(new AppError("Tidak ada data yang diubah.", 400));
        }

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        ).populate("category", "name description");

        if (!todo) {
            return next(new AppError("Todo tidak ditemukan.", 404));
        }

        await ActivityLog.create({
            user: req.user._id,
            todo: todo._id,
            action: "UPDATE",
            details: `Memperbarui Todo: ${todo.title}`
        });

        res.status(200).json({
            status: "success",
            message: "Todo berhasil diperbarui.",
            data: { todo }
        });
    })
);

// DELETE TODO
router.delete(
    "/:id",
    todoIdValidator,
    catchAsync(async (req, res, next) => {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return next(new AppError("Todo tidak ditemukan.", 404));
        }

        await ActivityLog.create({
            user: req.user._id,
            todo: todo._id,
            action: "DELETE",
            details: `Menghapus Todo: ${todo.title}`
        });

        res.status(200).json({
            status: "success",
            message: "Todo berhasil dihapus."
        });
    })
);

module.exports = router;