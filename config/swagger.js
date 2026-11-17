const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Magang Backend API",
            version: "1.0.0",
            description:
                "Dokumentasi API untuk project Gamelab Production Stage 2."
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Masukkan token JWT hasil Register atau Login."
                },

                apiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key",
                    description: "Masukkan API Key dari konfigurasi server."
                }
            },

            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        role: { type: "string", example: "user" }
                    }
                },

                Todo: {
                    type: "object",
                    properties: {
                        title: { type: "string", example: "Belajar Backend" },
                        description: {
                            type: "string",
                            example: "Mengerjakan project API"
                        },
                        completed: { type: "boolean", example: false },
                        category: {
                            type: "string",
                            nullable: true
                        }
                    }
                },

                Category: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "Sekolah" },
                        description: {
                            type: "string",
                            example: "Tugas sekolah"
                        }
                    }
                }
            }
        },

        paths: {
            "/": {
                get: {
                    tags: ["General"],
                    summary: "Mengecek status API",
                    responses: {
                        200: {
                            description: "API berjalan."
                        }
                    }
                }
            },

            "/api/auth/register": {
                post: {
                    tags: ["Authentication"],
                    summary: "Registrasi pengguna baru",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["name", "email", "password"],
                                    properties: {
                                        name: { type: "string", example: "Rifa Test" },
                                        email: {
                                            type: "string",
                                            example: "rifa@test.com"
                                        },
                                        password: {
                                            type: "string",
                                            example: "password123"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: "Registrasi berhasil." },
                        400: { description: "Validasi input gagal." },
                        409: { description: "Email sudah terdaftar." }
                    }
                }
            },

            "/api/auth/login": {
                post: {
                    tags: ["Authentication"],
                    summary: "Login pengguna",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["email", "password"],
                                    properties: {
                                        email: {
                                            type: "string",
                                            example: "rifa@test.com"
                                        },
                                        password: {
                                            type: "string",
                                            example: "password123"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: "Login berhasil." },
                        400: { description: "Validasi input gagal." },
                        401: { description: "Email atau password salah." }
                    }
                }
            },

            "/api/todos": {
                get: {
                    tags: ["Todos"],
                    summary: "Mengambil daftar Todo",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "page",
                            in: "query",
                            schema: { type: "integer", default: 1 }
                        },
                        {
                            name: "limit",
                            in: "query",
                            schema: { type: "integer", default: 10 }
                        },
                        {
                            name: "completed",
                            in: "query",
                            schema: { type: "boolean" }
                        },
                        {
                            name: "category",
                            in: "query",
                            schema: { type: "string" }
                        },
                        {
                            name: "search",
                            in: "query",
                            schema: { type: "string" }
                        },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["createdAt", "title", "completed"],
                                default: "createdAt"
                            }
                        },
                        {
                            name: "order",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["asc", "desc"],
                                default: "desc"
                            }
                        }
                    ],
                    responses: {
                        200: { description: "Daftar Todo berhasil diambil." },
                        401: { description: "Token tidak valid." }
                    }
                },

                post: {
                    tags: ["Todos"],
                    summary: "Menambahkan Todo",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Todo" }
                            }
                        }
                    },
                    responses: {
                        201: { description: "Todo berhasil ditambahkan." },
                        400: { description: "Validasi input gagal." },
                        401: { description: "Token tidak valid." }
                    }
                }
            },

            "/api/todos/{id}": {
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                get: {
                    tags: ["Todos"],
                    summary: "Mengambil detail Todo",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Detail Todo berhasil diambil." },
                        404: { description: "Todo tidak ditemukan." }
                    }
                },
                patch: {
                    tags: ["Todos"],
                    summary: "Memperbarui Todo",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        title: { type: "string" },
                                        description: { type: "string" },
                                        completed: { type: "boolean" },
                                        category: {
                                            type: "string",
                                            nullable: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: "Todo berhasil diperbarui." },
                        400: { description: "Data tidak valid." },
                        404: { description: "Todo tidak ditemukan." }
                    }
                },
                delete: {
                    tags: ["Todos"],
                    summary: "Menghapus Todo",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Todo berhasil dihapus." },
                        404: { description: "Todo tidak ditemukan." }
                    }
                }
            },

            "/api/categories": {
                get: {
                    tags: ["Categories"],
                    summary: "Mengambil semua kategori",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Daftar kategori berhasil diambil." }
                    }
                },
                post: {
                    tags: ["Categories"],
                    summary: "Menambahkan kategori",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Category" }
                            }
                        }
                    },
                    responses: {
                        201: { description: "Kategori berhasil ditambahkan." },
                        400: { description: "Validasi input gagal." }
                    }
                }
            },

            "/api/categories/{id}": {
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                get: {
                    tags: ["Categories"],
                    summary: "Mengambil detail kategori",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Detail kategori berhasil diambil." },
                        404: { description: "Kategori tidak ditemukan." }
                    }
                },
                patch: {
                    tags: ["Categories"],
                    summary: "Memperbarui kategori",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Category" }
                            }
                        }
                    },
                    responses: {
                        200: { description: "Kategori berhasil diperbarui." },
                        404: { description: "Kategori tidak ditemukan." }
                    }
                },
                delete: {
                    tags: ["Categories"],
                    summary: "Menghapus kategori",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Kategori berhasil dihapus." },
                        404: { description: "Kategori tidak ditemukan." }
                    }
                }
            },

            "/api/activity-logs": {
                get: {
                    tags: ["Activity Logs"],
                    summary: "Mengambil riwayat aktivitas pengguna",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "page",
                            in: "query",
                            schema: { type: "integer", default: 1 }
                        },
                        {
                            name: "limit",
                            in: "query",
                            schema: { type: "integer", default: 10 }
                        }
                    ],
                    responses: {
                        200: { description: "Riwayat aktivitas berhasil diambil." },
                        401: { description: "Token tidak valid." }
                    }
                }
            },

            "/api/statistics": {
                get: {
                    tags: ["Statistics"],
                    summary: "Mengambil statistik API",
                    security: [{ apiKeyAuth: [] }],
                    responses: {
                        200: { description: "Statistik berhasil diambil." },
                        401: { description: "API Key tidak valid." }
                    }
                }
            },

            "/api/protected": {
                get: {
                    tags: ["Authorization"],
                    summary: "Menguji akses dengan JWT",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Token valid." },
                        401: { description: "Token tidak valid." }
                    }
                }
            },

            "/api/admin": {
                get: {
                    tags: ["Authorization"],
                    summary: "Menguji akses khusus admin",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Akses admin berhasil." },
                        401: { description: "Token tidak valid." },
                        403: { description: "Akses ditolak." }
                    }
                }
            }
        }
    },

    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
