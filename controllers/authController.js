const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Membuat JWT Token
const signToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};

// Fitur Register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Nama, email, dan password wajib diisi'
            });
        }

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({
                message: 'Password minimal 8 karakter'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email sudah terdaftar'
            });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password
        });

        return res.status(201).json({
            message: 'Register berhasil',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register gagal:', error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email sudah terdaftar'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Terjadi kesalahan pada server'
        });
    }
};

// Fitur Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email dan password wajib diisi'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Password tidak diambil secara otomatis karena select: false
        const user = await User.findOne({
            email: normalizedEmail
        }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: 'Email atau password salah'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET belum diatur di file .env');

            return res.status(500).json({
                message: 'Konfigurasi autentikasi server belum lengkap'
            });
        }

        const token = signToken(user._id.toString());

        return res.status(200).json({
            message: 'Login berhasil',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login gagal:', error.message);

        return res.status(500).json({
            message: 'Terjadi kesalahan pada server'
        });
    }
};

module.exports = {
    register,
    login
};
