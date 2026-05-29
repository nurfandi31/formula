<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generations', function (Blueprint $table) {
            $table->id();
            $table->integer('num')->unique();
            $table->string('year');
            $table->string('leader');
            $table->string('secretary');
            $table->string('treasurer');
            $table->json('active_members')->nullable();
            $table->text('story');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generations');
    }
};
