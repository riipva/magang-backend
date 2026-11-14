const errorHandler = (err, req, res, next) => {
    // Ambil statusCode, default ke 500 jika tidak ada
    const statusCode = err.statusCode || err.status || 500;
    
    // Tentukan status: 'fail' untuk error client (4xx), 'error' untuk server (5xx)
    const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    // Kirim respons JSON ke client
    return res.status(statusCode).json({
        status: status,
        message: err.message || 'Terjadi kesalahan pada server.'
    });
};

module.exports = errorHandler;