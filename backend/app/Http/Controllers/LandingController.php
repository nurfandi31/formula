<?php

namespace App\Http\Controllers;

use App\Models\LandingConfig;
use App\Models\LandingSection;
use App\Models\LandingSetting;
use App\Models\LandingNavbar;
use App\Models\LandingFeature;
use App\Models\Testimonial;
use App\Models\GalleryItem;
use App\Models\Faq;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function show()
    {
        $sections = LandingSection::orderBy('order_index')->get();
        $settings = LandingSetting::all();
        $navbars = LandingNavbar::orderBy('order_index')->where('is_active', true)->get();
        $features = LandingFeature::orderBy('order_index')->where('is_active', true)->get();
        $testimonials = Testimonial::where('is_featured', true)->get();
        $gallery = GalleryItem::orderBy('event_date', 'desc')->get();
        $faqs = Faq::orderBy('order_index')->get();
        $socialLinks = SocialLink::where('is_active', true)->get();

        $config = LandingConfig::first();
        if (!$config) {
            $config = LandingConfig::create([
                'hero_title' => 'Mengabdi untuk Agama, Bangsa & Masyarakat Ngampon',
                'hero_subtitle' => 'Organisasi Kepemudaan & Keagamaan Resmi Dusun Ngampon, menggerakkan kepedulian sosial demi kemajuan bersama.',
                'sejarah' => 'FORMULA diinisiasi pada akhir tahun 2016 oleh sekelompok pemuda visioner didukung penuh oleh sesepuh dan tokoh agama Dusun Ngampon. Berbekal semangat swadaya, organisasi ini didirikan untuk mempersatukan potensi kepemudaan, menyebarkan syiar Islam moderat, serta melayani masyarakat melalui aksi kemanuisiaan.'
            ]);
        }

        return response()->json([
            'hero_title' => $config->hero_title,
            'hero_subtitle' => $config->hero_subtitle,
            'sejarah' => $config->sejarah,
            'config' => $config,
            'sections' => $sections,
            'settings' => $settings,
            'navbars' => $navbars,
            'features' => $features,
            'testimonials' => $testimonials,
            'gallery' => $gallery,
            'faqs' => $faqs,
            'social_links' => $socialLinks
        ]);
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

    public function saveSection(Request $request, $key)
    {
        $section = LandingSection::where('key', $key)->first();
        if (!$section) {
            $section = new LandingSection();
            $section->key = $key;
            $section->title = ucfirst($key) . ' Section';
            $section->order_index = 99;
            $section->is_active = true;
        }
        
        $section->content = $request->input('content', $section->content);
        $section->save();

        return response()->json(['success' => true, 'section' => $section]);
    }

    public function saveSettings(Request $request)
    {
        $settings = $request->input('settings', []);
        foreach ($settings as $key => $value) {
            LandingSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'type' => 'text']
            );
        }

        return response()->json(['success' => true]);
    }

    public function storeFeature(Request $request)
    {
        $id = $request->input('id');
        if ($id) {
            $feature = LandingFeature::find($id);
        } else {
            $feature = new LandingFeature();
        }

        $feature->title = $request->input('title');
        $feature->icon = $request->input('icon', '🌱');
        $feature->description = $request->input('description');
        $feature->badge = $request->input('badge');
        $feature->order_index = $request->input('order_index', 1);
        $feature->is_active = true;
        $feature->save();

        return response()->json(['success' => true, 'feature' => $feature]);
    }

    public function destroyFeature($id)
    {
        LandingFeature::destroy($id);
        return response()->json(['success' => true]);
    }

    public function storeGallery(Request $request)
    {
        $id = $request->input('id');
        if ($id) {
            $item = GalleryItem::find($id);
        } else {
            $item = new GalleryItem();
        }

        $item->title = $request->input('title');
        $item->image_url = $request->input('image_url');
        $item->category = $request->input('category', 'Kegiatan');
        $item->description = $request->input('description');
        $item->event_date = $request->input('event_date', date('Y-m-d'));
        $item->save();

        return response()->json(['success' => true, 'gallery_item' => $item]);
    }

    public function destroyGallery($id)
    {
        GalleryItem::destroy($id);
        return response()->json(['success' => true]);
    }

    public function storeFaq(Request $request)
    {
        $id = $request->input('id');
        if ($id) {
            $faq = Faq::find($id);
        } else {
            $faq = new Faq();
        }

        $faq->question = $request->input('question');
        $faq->answer = $request->input('answer');
        $faq->order_index = $request->input('order_index', 1);
        $faq->save();

        return response()->json(['success' => true, 'faq' => $faq]);
    }

    public function destroyFaq($id)
    {
        Faq::destroy($id);
        return response()->json(['success' => true]);
    }

    public function storeSocialLink(Request $request)
    {
        $id = $request->input('id');
        if ($id) {
            $link = SocialLink::find($id);
        } else {
            $link = new SocialLink();
        }

        $link->platform = $request->input('platform');
        $link->url = $request->input('url');
        $link->is_active = true;
        $link->save();

        return response()->json(['success' => true, 'social_link' => $link]);
    }

    public function destroySocialLink($id)
    {
        SocialLink::destroy($id);
        return response()->json(['success' => true]);
    }
}
