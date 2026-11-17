const { body, validationResult } = require("express-validator");

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

// VALIDASI REGISTER
const registerValidator = [
    body("name")
        .exists().withMessage("Nama wajib diisi.")
        .bail()
        .isString().withMessage("Nama harus berupa teks.")
        .bail()
        .trim()
        .notEmpty().withMessage("Nama tidak boleh kosong."),

    body("email")
        .exists().withMessage("Email wajib diisi.")
        .bail()
        .isString().withMessage("Email harus berupa teks.")
        .bail()
        .trim()
        .isEmail().withMessage("Format email tidak valid."),

    body("password")
        .exists().withMessage("Password wajib diisi.")
        .bail()
        .isString().withMessage("Password harus berupa teks.")
        .bail()
        .notEmpty().withMessage("Password tidak boleh kosong."),

    validate
];

// VALIDASI LOGIN
const loginValidator = [
    body("email")
        .exists().withMessage("Email wajib diisi.")
        .bail()
        .isString().withMessage("Email harus berupa teks.")
        .bail()
        .trim()
        .isEmail().withMessage("Format email tidak valid."),

    body("password")
        .exists().withMessage("Password wajib diisi.")
        .bail()
        .isString().withMessage("Password harus berupa teks.")
        .bail()
        .notEmpty().withMessage("Password tidak boleh kosong."),

    validate
];

module.exports = {
    registerValidator,
    loginValidator
};
