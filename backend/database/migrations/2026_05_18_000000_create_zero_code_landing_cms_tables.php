<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Seksi Landing Page (Layout & Konten Seksi)
        Schema::create('landing_sections', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // hero, about, gallery, kas, faq, contact
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->integer('order_index')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('content')->nullable(); // menyimpan detail text, image, link
            $table->json('style_configs')->nullable(); // menyimpan padding, background, dll
            $table->timestamps();
        });

        // 2. Tabel Pengaturan Sistem Global (Key-Value)
        Schema::create('landing_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general'); // branding, theme, seo, config
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Link Navigasi (Menu Manager Dinamis)
        Schema::create('landing_navbars', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url_path'); // cth: /#hero atau /agenda
            $table->integer('order_index')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Tabel Fitur Keunggulan (Dynamic Grid Icons)
        Schema::create('landing_features', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('icon')->default('ri-star-line'); // class remix icon
            $table->integer('order_index')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Tabel Pesan Hubungi Kami (Contact Form)
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message');
            $table->string('status')->default('unread'); // unread, read, replied
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        // 6. Tabel Testimoni
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->text('avatar')->nullable();
            $table->text('content');
            $table->integer('rating')->default(5);
            $table->boolean('is_featured')->default(true);
            $table->timestamps();
        });

        // 7. Tabel Galeri Kegiatan
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('image_url');
            $table->string('category')->default('Kegiatan');
            $table->date('event_date')->nullable();
            $table->timestamps();
        });

        // 8. Tabel FAQ
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 9. Tabel Social Media Links
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // instagram, facebook, tiktok, etc.
            $table->string('url');
            $table->string('icon'); // ri-instagram-line, ri-facebook-circle-fill
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('gallery_items');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('landing_features');
        Schema::dropIfExists('landing_navbars');
        Schema::dropIfExists('landing_settings');
        Schema::dropIfExists('landing_sections');
    }
};
