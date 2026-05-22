# Analisis & Panduan Backend (FORMULA) 🧪⚙️

Dokumen ini merangkum arsitektur, keamanan, dan spesifikasi API dari sisi server (backend) aplikasi FORMULA.

---

## 🛠️ Stack Teknologi Utama
Backend dibangun menggunakan framework PHP modern yang kokoh dan handal:
1. **Laravel 11**: Menyediakan RESTful API, sistem routing, validasi request, ORM Eloquent, dan keamanan bawaan.
2. **PHP 8.2+**: Runtime modern dengan fitur pengetikan data yang ketat dan efisien.
3. **Laravel Session & Cookie**: Otentikasi berbasis stateful session yang aman dari serangan pencurian token sisi klien (XSS).

---

## 🔒 Arsitektur Keamanan & Proteksi API
Aplikasi backend dilengkapi perlindungan ganda untuk menjaga integritas data organisasi:
* **Session Fixation Protection**: Memanggil `$request->session()->regenerate()` saat login berhasil untuk mencegah pembajakan sesi.
* **Brute-Force Rate Limiting**: Membatasi percobaan login maksimal 5 kali per menit per alamat IP.
* **CSRF Protection**: Mengamankan transaksi data dari pemalsuan request lintas situs.
* **Bcrypt Password Hashing**: Mengenkripsi kata sandi pengguna secara aman sebelum disimpan ke database.

---

## 🔌 Dokumentasi Endpoint API (`/api`)
Seluruh endpoint di bawah terdaftar pada file `routes/web.php` dan mengembalikan respon berformat JSON:

### 🔑 Modul Otentikasi
* **`POST /api/login`**: Memproses masuk akun (kredensial: `email`, `password`).
* **`POST /api/logout`**: Mengakhiri sesi pengguna aktif.
* **`GET /api/session`**: Memeriksa detail sesi pengguna yang sedang masuk.

### 🎨 Modul Landing Page CMS
* **`GET /api/landing`**: Mengambil seluruh komponen dinamis landing page.
* **`POST /api/landing`**: Mengubah teks Hero dan sejarah.
* **`POST /api/landing/sections/{key}`**: Menyimpan konten spesifik untuk seksi halaman.
* **`POST /api/landing/settings`**: Mengubah pengaturan global (logo, warna primer/sekunder).
* **`POST /api/landing/features`**: Menambah/mengubah fitur keunggulan.
* **`DELETE /api/landing/features/{id}`**: Menghapus fitur keunggulan.
* **`POST /api/landing/gallery`**: Menambah foto/kegiatan baru ke galeri.
* **`DELETE /api/landing/gallery/{id}`**: Menghapus galeri kegiatan.
* **`POST /api/landing/faqs`**: Menambah/mengubah tanya jawab FAQ.
* **`DELETE /api/landing/faqs/{id}`**: Menghapus FAQ.
* **`POST /api/landing/social-links`**: Menambah/mengubah tautan media sosial.
* **`DELETE /api/landing/social-links/{id}`**: Menghapus tautan media sosial.

### 💸 Modul Kas Keuangan
* **`GET /api/kas`**: Mengambil ringkasan saldo total, pemasukan, pengeluaran, dan riwayat transaksi.
* **`GET /api/kas/yearly`**: Mengambil rekapitulasi perhitungan kas tahunan kumulatif.
* **`POST /api/kas`**: Mencatat transaksi kas baru (`label`, `nominal`, `type`, `tanggal`).
* **`DELETE /api/kas/{id}`**: Menghapus riwayat transaksi kas tertentu.

### 📅 Modul Kegiatan & Agenda
* **`GET /api/activities`**: Mengambil daftar rapat pengurus dan agenda umum.
* **`POST /api/activities`**: Menambahkan rapat/agenda baru beserta keputusan rapat.
* **`DELETE /api/activities/{id}`**: Menghapus rapat/agenda.

### 📝 Modul Presensi & Kehadiran Anggota
* **`GET /api/attendance/{activity}`**: Mengambil log kehadiran anggota pada kegiatan tertentu.
* **`POST /api/attendance/{activity}`**: Menyimpan presensi kehadiran (PIN check-in, geofencing, atau status sakit/izin mandiri).

### 👥 Modul Pengurus & Anggota
* **`GET /api/members`**: Mengambil daftar seluruh pengurus terdaftar.
* **`POST /api/members`**: Membuat akun pengurus baru.
* **`PUT /api/members/{id}`**: Mengubah profil pengurus terdaftar.
* **`DELETE /api/members/{id}`**: Menghapus akun pengurus.
