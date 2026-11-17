const express = require("express");
const Category = require("../models/Category");
const Todo = require("../models/Todo");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const protect = require("../middleware/protect");

const {
    createCategoryValidator,
    updateCategoryValidator,
    categoryIdValidator
} = require("../validators/categoryValidator");

const router = express.Router();

router.use(protect);

// CREATE CATEGORY
router.post(
    "/",
    createCategoryValidator,
    catchAsync(async (req, res) => {
        const { name, description } = req.body;

        const category = await Category.create({
            name: name.trim(),
            description: description || "",
            user: req.user._id
        });

        res.status(201).json({
            status: "success",
            message: "Kategori berhasil ditambahkan.",
            data: { category }
        });
    })
);

// READ ALL CATEGORY
router.get(
    "/",
    catchAsync(async (req, res) => {
        const categories = await Category.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            results: categories.length,
            data: { categories }
        });
    })
);

// READ ONE CATEGORY
router.get(
    "/:id",
    categoryIdValidator,
    catchAsync(async (req, res, next) => {
        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            return next(new AppError("Kategori tidak ditemukan.", 404));
        }

        res.status(200).json({
            status: "success",
            data: { category }
        });
    })
);

// UPDATE CATEGORY
router.patch(
    "/:id",
    updateCategoryValidator,
    catchAsync(async (req, res, next) => {
        const { name, description } = req.body;
        const updates = {};

        if (name !== undefined) {
            updates.name = name.trim();
        }

        if (description !== undefined) {
            updates.description = description;
        }

        if (Object.keys(updates).length === 0) {
            return next(new AppError("Tidak ada data yang diubah.", 400));
        }

        const category = await Category.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return next(new AppError("Kategori tidak ditemukan.", 404));
        }

        res.status(200).json({
            status: "success",
            message: "Kategori berhasil diperbarui.",
            data: { category }
        });
    })
);

// DELETE CATEGORY
router.delete(
    "/:id",
    categoryIdValidator,
    catchAsync(async (req, res, next) => {
        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            return next(new AppError("Kategori tidak ditemukan.", 404));
        }

        // Lepaskan kategori dari todo yang menggunakannya
        await Todo.updateMany(
            {
                user: req.user._id,
                category: category._id
            },
            { $set: { category: null } }
        );

        await Category.deleteOne({ _id: category._id });

        res.status(200).json({
            status: "success",
            message: "Kategori berhasil dihapus."
        });
    })
);

module.exports = router;
