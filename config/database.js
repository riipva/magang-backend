// 1. Muat konfigurasi .env di baris paling atas agar process.env bisa dibaca
require('dotenv').config(); 
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        // 2. Validasi apakah MONGODB_URI ada nilainya
        if (!mongoURI) {
            throw new Error(
                'MONGODB_URI tidak ditemukan di .env'
            );
        }

        // 3. Lakukan koneksi ke MongoDB Atlas
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000 // Menunggu maks 15 detik jika ada masalah jaringan
        });

        console.log('MongoDB berhasil terhubung');
    } catch (error) {
        console.error('Gagal menghubungkan MongoDB.');
        console.error('Jenis error:', error.name);
        console.error('Pesan error:', error.message);

        // Jangan lakukan 'throw error' lagi di sini agar aplikasi test-db.js 
        // tidak langsung mati/crash saat mendeteksi error koneksi
    }
};

module.exports = connectDB;
