
# Rancangan Endpoint API Todo-List Management

Base URL: Base URL: http://localhost:3000/api

## 1. Auth

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| POST | /auth/register | Mendaftarkan pengguna | Publik |
| POST | /auth/login | Login pengguna | Publik |
| GET | /auth/me | Melihat profil pengguna | Login |

## 2. Todo

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| POST | /todos | Membuat tugas | Login |
| GET | /todos | Melihat daftar tugas milik sendiri | Login |
| GET | /todos/:id | Melihat detail tugas milik sendiri | Login |
| PATCH | /todos/:id | Mengubah tugas milik sendiri | Login |
| DELETE | /todos/:id | Menghapus tugas milik sendiri | Login |

## 3. Category

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| POST | /categories | Membuat kategori | Login |
| GET | /categories | Melihat kategori milik sendiri | Login |
| GET | /categories/:id | Melihat detail kategori milik sendiri | Login |
| PATCH | /categories/:id | Mengubah kategori milik sendiri | Login |
| DELETE | /categories/:id | Menghapus kategori milik sendiri | Login |

## 4. Activity Log

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | /activities | Melihat riwayat aktivitas sendiri | Login |
| GET | /activities/:id | Melihat detail aktivitas sendiri | Login |

Catatan: Activity Log dibuat otomatis oleh sistem
ketika pengguna melakukan aktivitas yang dicatat.

## 5. Stats

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | /stats | Melihat ringkasan statistik tugas sendiri | Login |

## Aturan Akses

1. Endpoint publik dapat diakses tanpa login.
2. Endpoint dengan akses Login memerlukan token JWT yang valid.
3. Pengguna hanya boleh melihat dan mengelola data miliknya sendiri.
4. Server harus memeriksa kepemilikan data sebelum melihat,
   mengubah, atau menghapus data berdasarkan ID.
5. Password harus disimpan dalam bentuk hash.
6. Activity Log tidak boleh dibuat atau diubah langsung
   oleh pengguna melalui endpoint umum.
