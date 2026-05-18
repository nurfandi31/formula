<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->string('activity_name');
            $table->string('user_email');
            $table->string('status'); // Hadir, Izin, Sakit, Alfa
            $table->text('notes')->nullable(); // Alasan izin/sakit
            $table->text('attachment')->nullable(); // Foto lampiran bukti
            $table->timestamp('checked_in_at')->nullable(); // Waktu check-in mandiri
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
