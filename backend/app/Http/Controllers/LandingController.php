<?php

namespace App\Http\Controllers;

use App\Models\LandingConfig;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function show()
    {
        $config = LandingConfig::first();
        if (!$config) {
            $config = LandingConfig::create([
                'hero_title' => 'Mengabdi untuk Agama, Bangsa & Masyarakat Ngampon',
                'hero_subtitle' => 'Organisasi Kepemudaan & Keagamaan Resmi Dusun Ngampon, menggerakkan kepedulian sosial demi kemajuan bersama.',
                'sejarah' => 'FORMULA diinisiasi pada akhir tahun 2016 oleh sekelompok pemuda visioner didukung penuh oleh sesepuh dan tokoh agama Dusun Ngampon. Berbekal semangat swadaya, organisasi ini didirikan untuk mempersatukan potensi kepemudaan, menyebarkan syiar Islam moderat, serta melayani masyarakat melalui aksi kemanusiaan.'
            ]);
        }
        return response()->json($config);
    }

    public function update(Request $request)
    {
        $config = LandingConfig::first();
        if (!$config) {
            $config = new LandingConfig();
        }

        $config->hero_title = $request->input('hero_title', $config->hero_title);
        $config->hero_subtitle = $request->input('hero_subtitle', $config->hero_subtitle);
        $config->sejarah = $request->input('sejarah', $config->sejarah);
        $config->save();

        return response()->json([
            'success' => true,
            'config' => $config
        ]);
    }
}
