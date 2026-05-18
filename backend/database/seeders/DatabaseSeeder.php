<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\LandingConfig;
use App\Models\KasTransaction;
use App\Models\Activity;
use App\Models\LandingSection;
use App\Models\LandingSetting;
use App\Models\LandingNavbar;
use App\Models\LandingFeature;
use App\Models\Testimonial;
use App\Models\GalleryItem;
use App\Models\Faq;
use App\Models\SocialLink;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Pengguna (Users & Roles)
        User::create([
            'name' => 'Fandi Ahmad',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('adminpassword123'),
            'role' => 'admin',
            'title' => 'Ketua Umum',
            'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
        ]);

        User::create([
            'name' => 'Aditya Pratama',
            'email' => 'adit@formula.org',
            'password' => Hash::make('member123'),
            'role' => 'anggota',
            'title' => 'Sekretaris I',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya'
        ]);

        User::create([
            'name' => 'Rina Amalia',
            'email' => 'rina@formula.org',
            'password' => Hash::make('member123'),
            'role' => 'anggota',
            'title' => 'Bendahara Umum',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina'
        ]);

        // 2. Seed Legacy Landing Config (Untuk kecocokan dengan Controller lama)
        LandingConfig::create([
            'hero_title' => 'Mengabdi untuk Agama, Bangsa & Masyarakat Ngampon',
            'hero_subtitle' => 'Organisasi Kepemudaan & Keagamaan Resmi Dusun Ngampon, menggerakkan kepedulian sosial demi kemajuan bersama.',
            'sejarah' => 'FORMULA diinisiasi pada akhir tahun 2016 oleh sekelompok pemuda visioner didukung penuh oleh sesepuh dan tokoh agama Dusun Ngampon. Berbekal semangat swadaya, organisasi ini didirikan untuk mempersatukan potensi kepemudaan, menyebarkan syiar Islam moderat, serta melayani masyarakat melalui aksi kemanusiaan.'
        ]);

        // 3. Seed Kas Transactions (Buku Kas Dinamis)
        KasTransaction::create([
            'label' => 'Kas Mingguan Bersama',
            'nominal' => 350000,
            'type' => 'pemasukan',
            'tanggal' => '04 Mei 2026'
        ]);

        KasTransaction::create([
            'label' => 'Konsumsi Rapat Bulanan',
            'nominal' => 120000,
            'type' => 'pengeluaran',
            'tanggal' => '04 Mei 2026'
        ]);

        // 4. Seed Activities (Agenda / Rapat dengan Absensi Mandiri PIN)
        Activity::create([
            'title' => 'Rapat Kerja 04 Mei',
            'date' => '2026-05-04',
            'type' => 'rapat',
            'status' => 'completed',
            'passcode' => '1234',
            'decisions' => [
                'Pembentukan divisi baru kehumasan',
                'Pemberlakuan iuran mingguan wajib Rp 10.000',
                'Rencana bakti sosial akhir bulan'
            ]
        ]);

        Activity::create([
            'title' => 'Rapat Bulanan Karang Taruna Mei',
            'date' => '2026-05-20',
            'type' => 'rapat',
            'status' => 'active', // Aktif agar langsung bisa di-absen PIN
            'passcode' => '7942',
            'latitude' => -7.560000,
            'longitude' => 110.820000,
            'decisions' => null
        ]);

        // 5. Seed Landing Sections (CMS Component Layout Builder)
        LandingSection::create([
            'key' => 'hero',
            'title' => 'Seksi Hero Utama',
            'subtitle' => 'Headline landing page depan',
            'order_index' => 1,
            'is_active' => true,
            'content' => [
                'hero_title' => 'Mengabdi untuk Agama, Bangsa & Masyarakat Ngampon',
                'hero_subtitle' => 'Organisasi Kepemudaan & Keagamaan Resmi Dusun Ngampon, menggerakkan kepedulian sosial demi kemajuan bersama.',
                'cta_text' => 'Mulai Jelajah',
                'cta_link' => '/#about',
                'image_url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                'show_cta' => true
            ],
            'style_configs' => [
                'background_type' => 'glassmorphic',
                'padding_top' => '100px',
                'padding_bottom' => '100px',
                'is_dark_mode' => true
            ]
        ]);

        LandingSection::create([
            'key' => 'about',
            'title' => 'Seksi Tentang & Sejarah',
            'subtitle' => 'Visi misi dan deskripsi organisasi',
            'order_index' => 2,
            'is_active' => true,
            'content' => [
                'sejarah' => 'FORMULA diinisiasi pada akhir tahun 2016 oleh sekelompok pemuda visioner didukung penuh oleh sesepuh dan tokoh agama Dusun Ngampon. Berbekal semangat swadaya, organisasi ini didirikan untuk mempersatukan potensi kepemudaan, menyebarkan syiar Islam moderat, serta melayani masyarakat melalui aksi kemanusiaan.',
                'visi' => 'Terwujudnya pemuda Ngampon yang unggul, agamis, kolaboratif, dan berdampak sosial nyata.',
                'misi' => [
                    'Membina keimanan dan kreativitas pemuda secara berkesinambungan.',
                    'Menyelenggarakan bakti sosial kemasyarakatan yang swadaya.',
                    'Mengembangkan transparansi keuangan dan kolaborasi organisasi.'
                ]
            ],
            'style_configs' => [
                'background_type' => 'gradient',
                'padding_top' => '80px',
                'padding_bottom' => '80px',
                'is_dark_mode' => false
            ]
        ]);

        LandingSection::create([
            'key' => 'kas_summary',
            'title' => 'Seksi Transparansi Kas Keuangan',
            'subtitle' => 'Grafik dan ringkasan kas masuk & keluar',
            'order_index' => 3,
            'is_active' => true,
            'content' => [
                'title_display' => 'Transparansi Kas Keuangan Kepercayaan Warga',
                'subtitle_display' => 'Laporan keuangan kas pemuda di-update secara real-time.'
            ],
            'style_configs' => []
        ]);

        LandingSection::create([
            'key' => 'gallery',
            'title' => 'Seksi Galeri Kegiatan',
            'subtitle' => 'Klip foto-foto dokumentasi sosial',
            'order_index' => 4,
            'is_active' => true,
            'content' => [
                'title_display' => 'Dokumentasi Aksi & Bakti Sosial',
                'subtitle_display' => 'Setiap momen gotong royong terabadikan dengan rapi.'
            ],
            'style_configs' => []
        ]);

        LandingSection::create([
            'key' => 'faq',
            'title' => 'Seksi Accordion FAQ',
            'subtitle' => 'Daftar tanya jawab pengunjung',
            'order_index' => 5,
            'is_active' => true,
            'content' => [],
            'style_configs' => []
        ]);

        // 6. Seed Landing Settings (Global variables)
        LandingSetting::create([
            'key' => 'brand_name',
            'value' => 'FORMULA',
            'group' => 'branding',
            'description' => 'Nama organisasi pemuda di header dan footer.'
        ]);

        LandingSetting::create([
            'key' => 'primary_color',
            'value' => '#6366f1',
            'group' => 'theme',
            'description' => 'Warna primer utama (Hex) untuk tombol.'
        ]);

        LandingSetting::create([
            'key' => 'secondary_color',
            'value' => '#4f46e5',
            'group' => 'theme',
            'description' => 'Warna sekunder (Hex) untuk gradasi.'
        ]);

        LandingSetting::create([
            'key' => 'glass_blur',
            'value' => '16px',
            'group' => 'theme',
            'description' => 'Tingkat intensitas blur efek glassmorphism.'
        ]);

        LandingSetting::create([
            'key' => 'font_family',
            'value' => 'Outfit',
            'group' => 'theme',
            'description' => 'Keluarga huruf Google Fonts yang dimuat.'
        ]);

        LandingSetting::create([
            'key' => 'seo_title',
            'value' => 'FORMULA - Forum Pemuda Pemudi Ngampon',
            'group' => 'seo',
            'description' => 'Judul tab browser (SEO Meta Title).'
        ]);

        LandingSetting::create([
            'key' => 'seo_desc',
            'value' => 'Portal resmi dan dashboard absensi Forum Pemuda Pemudi Ngampon.',
            'group' => 'seo',
            'description' => 'Deskripsi pencarian di Google (SEO Meta Description).'
        ]);

        LandingSetting::create([
            'key' => 'email_notification',
            'value' => 'admin@formula.org',
            'group' => 'config',
            'description' => 'Alamat email admin tujuan notifikasi form Hubungi Kami.'
        ]);

        // 7. Seed Landing Navbars (Menu Header Dinamis)
        LandingNavbar::create(['label' => 'Beranda', 'url_path' => '/#hero', 'order_index' => 1]);
        LandingNavbar::create(['label' => 'Tentang Kami', 'url_path' => '/#about', 'order_index' => 2]);
        LandingNavbar::create(['label' => 'Kas Transparan', 'url_path' => '/#kas', 'order_index' => 3]);
        LandingNavbar::create(['label' => 'Agenda Rapat', 'url_path' => '/#activities', 'order_index' => 4]);
        LandingNavbar::create(['label' => 'Dokumentasi', 'url_path' => '/#gallery', 'order_index' => 5]);
        LandingNavbar::create(['label' => 'FAQ', 'url_path' => '/#faq', 'order_index' => 6]);

        // 8. Seed Landing Features (Dynamic Grid Icons)
        LandingFeature::create([
            'title' => 'Transparansi Kas',
            'description' => 'Laporan keuangan kas masuk dan keluar di-update secara real-time demi menjaga keterbukaan.',
            'icon' => 'ri-shield-flash-line',
            'order_index' => 1
        ]);

        LandingFeature::create([
            'title' => 'Presensi QR & PIN',
            'description' => 'Kemudahan melakukan absensi rapat mandiri secara digital tanpa antrean kertas.',
            'icon' => 'ri-qr-code-line',
            'order_index' => 2
        ]);

        LandingFeature::create([
            'title' => 'Kolaborasi Positif',
            'description' => 'Wadah berkumpulnya pemuda Ngampon untuk menggagas aksi kemanusiaan dan bakti sosial.',
            'icon' => 'ri-group-line',
            'order_index' => 3
        ]);

        // 9. Seed Testimonials (Social Proof)
        Testimonial::create([
            'name' => 'Budi Santoso',
            'role' => 'Ketua RT 02 Ngampon',
            'content' => 'Kehadiran adik-adik FORMULA memberikan energi positif bagi dusun kita. Aksi sosial mereka sangat membantu warga.',
            'rating' => 5,
            'is_featured' => true
        ]);

        Testimonial::create([
            'name' => 'H. Ahmad Dahlan',
            'role' => 'Tokoh Agama Dusun',
            'content' => 'Sangat bangga melihat pemuda Ngampon yang agamis dan aktif mengadakan kajian serta bakti sosial swadaya.',
            'rating' => 5,
            'is_featured' => true
        ]);

        // 10. Seed Gallery Items (Dokumentasi Momen)
        GalleryItem::create([
            'title' => 'Bakti Sosial Ramadhan 2026',
            'description' => 'Pembagian sembako gratis untuk warga yang membutuhkan di sekitar dusun Ngampon.',
            'image_url' => 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
            'category' => 'Bakti Sosial',
            'event_date' => '2026-04-12'
        ]);

        GalleryItem::create([
            'title' => 'Kerja Bakti Balai Dusun',
            'description' => 'Gotong royong membersihkan dan mengecat ulang pagar Balai Desa Ngampon.',
            'image_url' => 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
            'category' => 'Sosial',
            'event_date' => '2026-05-02'
        ]);

        // 11. Seed FAQs
        Faq::create([
            'question' => 'Apakah keanggotaan FORMULA hanya untuk warga asli Ngampon?',
            'answer' => 'Ya, keanggotaan resmi ditujukan untuk pemuda-pemudi yang berdomisili di Dusun Ngampon, namun kami sangat terbuka untuk kolaborasi aksi sosial lintas desa!',
            'order_index' => 1
        ]);

        Faq::create([
            'question' => 'Bagaimana cara melakukan absensi mandiri saat rapat?',
            'answer' => 'Cukup login menggunakan akun Anggota Anda saat rapat dimulai, pilih opsi check-in, lalu masukkan 4-digit PIN yang ditampilkan di proyektor oleh admin.',
            'order_index' => 2
        ]);

        // 12. Seed Social Links
        SocialLink::create([
            'platform' => 'instagram',
            'url' => 'https://instagram.com/formula_ngampon',
            'icon' => 'ri-instagram-line'
        ]);

        SocialLink::create([
            'platform' => 'youtube',
            'url' => 'https://youtube.com/formula_ngampon',
            'icon' => 'ri-youtube-line'
        ]);

        SocialLink::create([
            'platform' => 'whatsapp',
            'url' => 'https://wa.me/628123456789',
            'icon' => 'ri-whatsapp-line'
        ]);
    }
}
