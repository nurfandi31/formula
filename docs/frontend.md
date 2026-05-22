# Analisis & Panduan Frontend (FORMULA) 🧪✨

Dokumen ini merangkum seluruh arsitektur, teknologi, dan implementasi sisi klien (frontend) dari aplikasi FORMULA (Forum Pemuda Pemudi Ngampon).

---

## 🛠️ Stack Teknologi Utama
Aplikasi frontend dibangun menggunakan ekosistem Vue 3 modern yang dirancang untuk performa tinggi dan estetika visual premium:
1. **Vue 3 (Composition API)**: Framework inti untuk reaktivitas dan struktur komponen modern.
2. **Vite**: Build tool super cepat untuk pengembangan dan kompilasi modul.
3. **TailwindCSS**: Utilitas styling kelas dunia untuk tata letak reaktif dan cepat.
4. **Pinia**: State management untuk sinkronisasi data terpusat antar komponen.
5. **Vue Router**: Pengatur navigasi halaman dengan Navigation Guards untuk hak akses.

---

## 🎨 Konsep & Desain Visual
Situs dirancang menggunakan standar estetika antarmuka premium:
* **Glassmorphic Layout**: Efek transparansi kaca dengan backdrop blur modern pada kartu dan dashboard.
* **Premium Color Palette**: Dominasi warna hijau emerald (`emerald-500`), hijau botol, dan aksen teal yang melambangkan kepemudaan dan kesegaran.
* **Modern Typography**: Menggunakan Google Fonts **Outfit** atau **Inter** untuk keterbacaan tingkat tinggi di perangkat mobile dan desktop.
* **Micro-Animations**: Transisi halus dan hover effect dinamis untuk tombol, input, dan menu navigasi.

---

## 🗄️ Manajemen State Terpusat (Pinia Stores)
Seluruh komunikasi data dengan Backend API dikelola secara modular melalui Pinia stores di direktori `src/stores/`:

1. **`auth.js`**
   * Mengelola sesi pengguna, login, logout, pendaftaran, dan informasi profil.
   * Menyimpan status notifikasi anggota.
   * Melakukan fetch data seluruh anggota untuk modul admin.

2. **`activities.js`**
   * Menyimpan agenda rapat dan hasil keputusan bersama (notulen).
   * Sinkronisasi data rapat dinamis dari database.

3. **`attendance.js`**
   * Mengelola data kehadiran presensi rapat.
   * Melakukan check-in PIN mandiri dan pengiriman berkas izin/sakit anggota.

4. **`financials.js`**
   * Mengelola transaksi kas masuk/keluar.
   * Sinkronisasi rekapitulasi tahunan.

5. **`landing.js`**
   * Mengelola konfigurasi CMS landing page secara penuh (teks hero, sejarah, faqs, galeri, medsos).

6. **`social.js` (Master Orchestrator)**
   * Mengimpor dan mengekspos semua store di atas secara terpusat untuk mempermudah integrasi komponen.

---

## 🔒 Proteksi Navigasi (Vue Router Guards)
Sistem memisahkan akses pengguna berdasarkan peran (**Role-Based Access Control / RBAC**) secara reaktif pada file `src/router/index.js`:

```javascript
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const store = useSocialStore()
    if (!store.currentUser) {
      next({ name: 'login' })
    } else if (to.meta.role && store.currentUser.role !== to.meta.role) {
      if (store.currentUser.role === 'admin') {
        next({ name: 'admin' })
      } else {
        next({ name: 'anggota-dashboard' })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})
```

---

## 🎨 Dynamic Theme Engine (Zero-Code Visuals)
Warna branding dan blur dapat disesuaikan tanpa menyentuh kode program dengan memanfaatkan CSS variables pada `:root` HTML:

```javascript
// Di dalam landing store
const applyDynamicTheme = (settings) => {
  const root = document.documentElement;
  const primary = settings.find(s => s.key === 'primary_color')?.value || '#10b981';
  const secondary = settings.find(s => s.key === 'secondary_color')?.value || '#059669';
  const blur = settings.find(s => s.key === 'glass_blur')?.value || '16px';
  
  root.style.setProperty('--primary-color', primary);
  root.style.setProperty('--secondary-color', secondary);
  root.style.setProperty('--glass-blur', blur);
}
```
