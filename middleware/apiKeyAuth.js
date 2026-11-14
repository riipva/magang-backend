
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!process.env.API_KEY) {
        return res.status(500).json({
            status: "error",
            message: "API Key belum dikonfigurasi di server."
        });
    }

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            status: "fail",
            message: "API Key tidak valid atau tidak ditemukan."
        });
    }

    next();
};

module.exports = apiKeyAuth;
