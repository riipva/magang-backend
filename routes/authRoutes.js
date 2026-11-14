
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const {
    registerValidator,
    loginValidator
} = require("../validators/authValidator");

const router = express.Router();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });
};

// REGISTER
router.post(
    "/register",
    registerValidator,
    catchAsync(async (req, res, next) => {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return next(new AppError("Email sudah terdaftar.", 409));
        }

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        const token = signToken(user._id.toString());

        res.status(201).json({
            status: "success",
            message: "Registrasi berhasil.",
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    })
);

// LOGIN
router.post(
    "/login",
    loginValidator,
    catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return next(
                new AppError("Email atau password salah.", 401)
            );
        }

        const token = signToken(user._id.toString());

        res.status(200).json({
            status: "success",
            message: "Login berhasil.",
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    })
);

module.exports = router;
