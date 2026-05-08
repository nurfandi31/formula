<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\LandingConfig;
use App\Models\KasTransaction;
use App\Models\Activity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
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

        LandingConfig::create([
            'hero_title' => 'Mengabdi untuk Agama, Bangsa & Masyarakat Ngampon',
            'hero_subtitle' => 'Organisasi Kepemudaan & Keagamaan Resmi Dusun Ngampon, menggerakkan kepedulian sosial demi kemajuan bersama.',
            'sejarah' => 'FORMULA diinisiasi pada akhir tahun 2016 oleh sekelompok pemuda visioner didukung penuh oleh sesepuh dan tokoh agama Dusun Ngampon. Berbekal semangat swadaya, organisasi ini didirikan untuk mempersatukan potensi kepemudaan, menyebarkan syiar Islam moderat, serta melayani masyarakat melalui aksi kemanusiaan.'
        ]);

        KasTransaction::create([
            'label' => 'Kas Mingguan Bersama',
            'nominal' => 350000,
            'type' => 'pemasukan',
            'icon' => '🍱',
            'tanggal' => '04 Mei 2026'
        ]);

        KasTransaction::create([
            'label' => 'Konsumsi Rapat Bulanan',
            'nominal' => 120000,
            'type' => 'pengeluaran',
            'icon' => '🍱',
            'tanggal' => '04 Mei 2026'
        ]);

        Activity::create([
            'title' => 'Rapat Kerja 04 Mei',
            'date' => '2026-05-04',
            'type' => 'rapat',
            'decisions' => [
                'Pembentukan divisi baru kehumasan',
                'Pemberlakuan iuran mingguan wajib Rp 10.000',
                'Rencana bakti sosial akhir bulan'
            ]
        ]);
    }
}
