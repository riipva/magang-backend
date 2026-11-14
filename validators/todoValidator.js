const { body, param, query, validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            message: "Validasi input gagal.",
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};

// Validasi membuat todo
const createTodoValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Judul todo wajib diisi.")
        .isString()
        .withMessage("Judul todo harus berupa teks."),

    body("description")
        .optional()
        .isString()
        .withMessage("Description harus berupa teks."),

    body("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed harus bernilai true atau false."),

    body("category")
        .optional({ values: "falsy" })
        .isMongoId()
        .withMessage("ID kategori tidak valid."),

    validate
];

// Validasi memperbarui todo
const updateTodoValidator = [
    param("id")
        .isMongoId()
        .withMessage("ID todo tidak valid."),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Judul todo wajib diisi.")
        .isString()
        .withMessage("Judul todo harus berupa teks."),

    body("description")
        .optional()
        .isString()
        .withMessage("Description harus berupa teks."),

    body("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed harus bernilai true atau false."),

    body("category")
        .optional()
        .custom((value) => {
            if (value === null || value === "") return true;
            return /^[a-fA-F0-9]{24}$/.test(value);
        })
        .withMessage("ID kategori tidak valid."),

    validate
];

// Validasi ID todo
const todoIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("ID todo tidak valid."),

    validate
];

// Validasi query pagination dan filter
const todoQueryValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page harus berupa angka minimal 1."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit harus berupa angka antara 1 sampai 100."),

    query("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed harus bernilai true atau false."),

    query("category")
        .optional()
        .custom((value) => value === "null" || /^[a-fA-F0-9]{24}$/.test(value))
        .withMessage("ID kategori tidak valid."),

    query("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "title", "completed"])
        .withMessage("Kolom sorting tidak valid."),

    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Order harus asc atau desc."),

    query("search")
        .optional()
        .isString()
        .withMessage("Search harus berupa teks."),

    validate
];

module.exports = {
    createTodoValidator,
    updateTodoValidator,
    todoIdValidator,
    todoQueryValidator
};