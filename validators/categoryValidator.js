const { body, param, validationResult } = require("express-validator");

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

// Validasi membuat kategori
const createCategoryValidator = [
    body("name")
        .isString()
        .withMessage("Nama kategori harus berupa teks.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Nama kategori wajib diisi."),

    body("description")
        .optional()
        .isString()
        .withMessage("Description harus berupa teks."),

    validate
];

// Validasi memperbarui kategori
const updateCategoryValidator = [
    param("id")
        .isMongoId()
        .withMessage("ID kategori tidak valid."),

    body("name")
        .optional()
        .isString()
        .withMessage("Nama kategori harus berupa teks.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Nama kategori tidak boleh kosong."),

    body("description")
        .optional()
        .isString()
        .withMessage("Description harus berupa teks."),

    validate
];

// Validasi ID kategori
const categoryIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("ID kategori tidak valid."),

    validate
];

module.exports = {
    createCategoryValidator,
    updateCategoryValidator,
    categoryIdValidator
};
