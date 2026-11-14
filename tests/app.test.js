
jest.mock("../models/Todo", () => ({
    countDocuments: jest.fn()
}));

jest.mock("../models/Category", () => ({
    countDocuments: jest.fn()
}));

jest.mock("../models/User", () => ({
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
}));

const request = require("supertest");
const app = require("../server");

const Todo = require("../models/Todo");
const Category = require("../models/Category");
const User = require("../models/User");

describe("Pengujian API", () => {
    const mockUser = {
        _id: "user-test-123",
        name: "Rifa Test",
        email: "rifa@test.com",
        role: "user",
        comparePassword: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();

        User.countDocuments.mockResolvedValue(8);
        Category.countDocuments.mockResolvedValue(0);

        Todo.countDocuments.mockImplementation((filter = {}) => {
            if (filter.completed === true) {
                return Promise.resolve(1);
            }

            if (filter.completed === false) {
                return Promise.resolve(13);
            }

            return Promise.resolve(14);
        });

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);
    });

    // PENGUJIAN API UTAMA

    test("GET / harus mengembalikan status 200", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
    });

    test("GET /route-tidak-ada harus mengembalikan status 404", async () => {
        const response = await request(app).get("/route-tidak-ada");

        expect(response.status).toBe(404);
    });

    // PENGUJIAN STATISTICS

    test("Statistics tanpa API Key harus mengembalikan status 401", async () => {
        const response = await request(app).get("/api/statistics");

        expect(response.status).toBe(401);
    });

    test("Statistics dengan API Key salah harus mengembalikan status 401", async () => {
        const response = await request(app)
            .get("/api/statistics")
            .set("x-api-key", "api-key-salah");

        expect(response.status).toBe(401);
    });

    test("Statistics dengan API Key benar harus mengembalikan status 200", async () => {
        const response = await request(app)
            .get("/api/statistics")
            .set("x-api-key", process.env.API_KEY);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.users.total).toBe(8);
        expect(response.body.data.todos.total).toBe(14);
        expect(response.body.data.todos.completed).toBe(1);
        expect(response.body.data.todos.pending).toBe(13);
        expect(response.body.data.categories.total).toBe(0);
    });

    test("Jumlah Todo selesai dan belum selesai harus sesuai total Todo", async () => {
        const response = await request(app)
            .get("/api/statistics")
            .set("x-api-key", process.env.API_KEY);

        const todos = response.body.data.todos;

        expect(todos.completed + todos.pending).toBe(todos.total);
    });

    // PENGUJIAN REGISTER

    test("Register berhasil harus mengembalikan status 201", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Rifa Test",
                email: "rifa@test.com",
                password: "password123"
            });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Registrasi berhasil.");
        expect(response.body.token).toBeDefined();
        expect(response.body.data.user.email).toBe("rifa@test.com");

        expect(User.create).toHaveBeenCalled();
    });

    test("Register dengan email terdaftar harus mengembalikan status 409", async () => {
        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Rifa Test",
                email: "rifa@test.com",
                password: "password123"
            });

        expect(response.status).toBe(409);
        expect(response.body.status).toBe("fail");
    });

    test("Register dengan input tidak valid harus mengembalikan status 400", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "",
                email: "email-salah",
                password: ""
            });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe("fail");
    });

    // PENGUJIAN LOGIN

    test("Login berhasil harus mengembalikan status 200", async () => {
        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser)
        });

        mockUser.comparePassword.mockResolvedValue(true);

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "rifa@test.com",
                password: "password123"
            });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Login berhasil.");
        expect(response.body.token).toBeDefined();
        expect(response.body.data.user.email).toBe("rifa@test.com");
    });

    test("Login dengan email atau password salah harus mengembalikan status 401", async () => {
        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "rifa@test.com",
                password: "password-salah"
            });

        expect(response.status).toBe(401);
    });

    test("Login dengan input tidak valid harus mengembalikan status 400", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "email-salah",
                password: ""
            });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe("fail");
    });
});
