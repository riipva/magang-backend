# Magang Backend API

REST API untuk aplikasi Todo Management yang dikembangkan sebagai bagian dari project **Gamelab Production Stage 2**.

Project ini dibangun menggunakan Node.js, Express.js, dan MongoDB dengan fitur autentikasi, pengelolaan Todo, kategori, pencatatan aktivitas, statistik, serta dokumentasi API menggunakan Swagger.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi-yang-digunakan)
- [Struktur Project](#struktur-project)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Menjalankan Pengujian](#menjalankan-pengujian)
- [Dokumentasi API](#dokumentasi-api)
- [Daftar Endpoint](#daftar-endpoint)

## Fitur Utama

### 1. Authentication
- Registrasi pengguna.
- Login pengguna.
- Password hashing menggunakan bcrypt.
- Autentikasi menggunakan JSON Web Token (JWT).

### 2. Todo Management
- Menambahkan Todo.
- Melihat daftar Todo.
- Melihat detail Todo.
- Mengubah Todo.
- Menghapus Todo.
- Mengatur status penyelesaian Todo.
- Pagination.
- Filtering berdasarkan status dan kategori.
- Pencarian Todo.
- Sorting data Todo.

### 3. Category Management
- Menambahkan kategori.
- Melihat daftar kategori.
- Melihat detail kategori.
- Mengubah kategori.
- Menghapus kategori.

### 4. Activity Log
- Mencatat aktivitas pengguna pada Todo.
- Melihat riwayat aktivitas pengguna.
- Pagination riwayat aktivitas.

### 5. Statistics
- Menampilkan statistik Todo.
- Melindungi endpoint statistik menggunakan API Key.

### 6. Authorization
- Melindungi endpoint menggunakan JWT.
- Membatasi akses endpoint tertentu berdasarkan role pengguna.

### 7. API Documentation
- Dokumentasi API menggunakan Swagger UI.
- Mendukung autentikasi JWT dan API Key.

### 8. Automated Testing
- Pengujian API menggunakan Jest.
- Pengujian HTTP menggunakan Supertest.

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| Node.js | Runtime JavaScript |
| Express.js | Framework backend |
| MongoDB | Database |
| Mongoose | ODM MongoDB |
| bcryptjs | Password hashing |
| JSON Web Token | Autentikasi |
| express-validator | Validasi input |
| Jest | Automated testing |
| Supertest | HTTP API testing |
| Swagger | Dokumentasi API |
| dotenv | Pengelolaan environment variables |

## Struktur Project

```text
magang-backend/
├── config/
├── controllers/
├── docs/
├── middleware/
├── models/
├── routes/
├── services/
├── tests/
├── utils/
├── validators/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## Persyaratan

Pastikan perangkat sudah memiliki:

- Node.js
- npm
- MongoDB Atlas atau MongoDB yang dapat diakses aplikasi.

## Instalasi

1. Clone repository:

```bash
git clone URL_REPOSITORY
```

2. Masuk ke folder project:

```bash
cd magang-backend
```

3. Install dependencies:

```bash
npm install
```

4. Buat file `.env` berdasarkan `.env.example`.

5. Isi konfigurasi environment sesuai kebutuhan.

## Konfigurasi Environment

Buat file `.env` di folder utama project.

Contoh konfigurasi:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
API_KEY=your_api_key
```

Keterangan:

| Variable | Keterangan |
|---|---|
| PORT | Port server |
| MONGODB_URI | URI koneksi MongoDB |
| JWT_SECRET | Secret untuk menandatangani JWT |
| JWT_EXPIRES_IN | Masa berlaku token JWT |
| API_KEY | Kunci akses endpoint Statistics |

**Penting:** Jangan mengunggah file `.env` atau membagikan nilai secret dan API Key ke publik.

## Menjalankan Aplikasi

Jalankan server:

```bash
npm start
```

Untuk mode development:

```bash
npm run dev
```

Jika berhasil, server berjalan di:

```text
http://localhost:3000
```

## Menjalankan Pengujian

Jalankan seluruh automated test menggunakan:

```bash
npm test
```

Pengujian menggunakan Jest dan Supertest.

Hasil pengujian project:

```text
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

## Dokumentasi API

Project menggunakan Swagger UI untuk menampilkan dokumentasi endpoint API secara interaktif.

Setelah server berjalan, buka:

```text
http://localhost:3000/api-docs
```

Swagger UI menyediakan informasi endpoint, parameter, request, response, serta konfigurasi authorization.

## Daftar Endpoint

### General

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | Mengecek status API |

### Authentication

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | Registrasi pengguna |
| POST | `/api/auth/login` | Login pengguna |

### Todo

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/todos` | Mengambil daftar Todo |
| POST | `/api/todos` | Menambahkan Todo |
| GET | `/api/todos/:id` | Mengambil detail Todo |
| PATCH | `/api/todos/:id` | Mengubah Todo |
| DELETE | `/api/todos/:id` | Menghapus Todo |

### Category

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/categories` | Mengambil daftar kategori |
| POST | `/api/categories` | Menambahkan kategori |
| GET | `/api/categories/:id` | Mengambil detail kategori |
| PATCH | `/api/categories/:id` | Mengubah kategori |
| DELETE | `/api/categories/:id` | Menghapus kategori |

### Activity Log

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/activity-logs` | Mengambil riwayat aktivitas |

### Statistics

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/statistics` | Mengambil statistik Todo |

Endpoint Statistics membutuhkan API Key.

### Authorization

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/protected` | Menguji akses menggunakan JWT |
| GET | `/api/admin` | Menguji akses khusus admin |

## Keamanan

- Password disimpan menggunakan hashing bcrypt.
- Autentikasi menggunakan JWT.
- Endpoint tertentu dilindungi middleware authorization.
- Endpoint Statistics menggunakan API Key.
- Environment variables disimpan dalam file `.env`.
- File sensitif dan dependencies lokal dikecualikan menggunakan `.gitignore`.

## Pengembang

Project ini dibuat sebagai bagian dari kegiatan Magang Backend Gamelab Production Stage 2.
