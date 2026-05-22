# Analisis & Fungsionalitas Fitur (FORMULA) 🧪🚀

Dokumen ini merangkum seluruh fitur utama aplikasi FORMULA yang terbagi menjadi tiga area fungsional: Landing Page Publik, Dashboard Admin, dan Dashboard Anggota.

---

## 🌐 1. Landing Page Publik
Halaman depan dirancang menarik dan informatif untuk mengenalkan organisasi kepada masyarakat umum.
* **Hero Banner**: Judul slogan dinamis dan deskripsi utama pengabdian dusun.
* **Transparansi Kas**: Widget rekapitulasi total uang kas masuk, keluar, dan saldo aktif saat ini secara *real-time* untuk menjaga kepercayaan warga.
* **Galeri Dokumentasi**: Grid foto interaktif untuk memamerkan keseruan kegiatan bakti sosial, olahraga, maupun keagamaan yang telah berjalan.
* **Seksi Sejarah & Visi Misi**: Teks edukatif tentang sejarah berdirinya FORMULA sejak akhir 2016.
* **FAQ Accordion**: Tanya jawab cepat bagi calon anggota baru atau warga yang ingin tahu iuran dan jadwal rapat.
* **Form Hubungi Kami**: Memungkinkan pengunjung mengirim pesan saran langsung ke basis data.

---

## 👑 2. Dashboard Administrator (Admin Panel)
Pusat kendali utama bagi pengurus inti (Ketua, Sekretaris, Bendahara) untuk mengelola data operasional organisasi:

* **Manajemen Anggota (CRUD)**:
  * Membuat, mengedit, atau menghapus akun pengurus/anggota.
  * Menugaskan jabatan (`title`) dan avatar profil.

* **Manajemen Keuangan Kas**:
  * Menambah transaksi masuk (iuran, donasi) dan pengeluaran (pembelian alat, konsumsi).
  * Menghitung total saldo kumulatif dan starting/ending balance per tahun secara otomatis.

* **Manajemen Kegiatan & Presensi**:
  * Membuat agenda rapat/kegiatan baru dengan draf keputusan (notulen).
  * **Kontrol Absensi Sesi**: Tombol "Buka Absen" untuk mengaktifkan sesi presensi (men-generate PIN acak 4-digit untuk ditampilkan di layar proyektor).
  * **Otomatisasi Alfa**: Menutup sesi absen secara otomatis mengubah status anggota yang absen tanpa keterangan menjadi **Alfa**.
  * **Moderasi Surat Izin**: Meninjau surat izin/sakit yang diunggah anggota, membaca alasannya, dan mengeklik "Setuju" atau "Tolak".

* **Landing Page CMS (Zero-Code Builder)**:
  * Mengedit teks hero, sejarah, faqs, dan link medsos secara dinamis.
  * Menyesuaikan tema warna primer/sekunder dan intensitas backdrop blur.

---

## 🙋‍♂️ 3. Dashboard Anggota (Member Area)
Portal mandiri yang reaktif bagi anggota untuk check-in kehadiran secara aman dan melihat riwayat kontribusi mereka:

* **Statistik Pribadi (Personal Stats)**:
  * Menampilkan tingkat kehadiran rapat (%).
  * Memantau status iuran kas bulanan.

* **Sistem Absensi Mandiri (Check-In)**:
  * Memasukkan PIN 4-digit yang ditayangkan admin di ruangan rapat untuk konfirmasi kehadiran.
  * Validasi opsional menggunakan Geofencing GPS (hanya bisa check-in jika berada dalam radius 50 meter dari koordinat rapat).

* **RSVP Pengajuan Izin/Sakit Mandiri**:
  * Mengajukan keterangan tidak hadir sebelum rapat dimulai dengan menuliskan alasan dan mengunggah foto bukti (surat dokter/tugas).

* **Portal Keputusan Rapat (Notulen)**:
  * Membaca daftar keputusan rapat yang disepakati bersama secara transparan langsung dari handphone.
