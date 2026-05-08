<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_configs', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title');
            $table->string('hero_subtitle');
            $table->text('sejarah');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_configs');
    }
};
