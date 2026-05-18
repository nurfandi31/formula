<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("
            CREATE TABLE IF NOT EXISTS kas_saldo (
                id INT PRIMARY KEY DEFAULT 1,
                total_pemasukan DECIMAL(15,2) DEFAULT 0,
                total_pengeluaran DECIMAL(15,2) DEFAULT 0,
                saldo_akhir DECIMAL(15,2) DEFAULT 0
            );
        ");

        DB::unprepared("
            INSERT IGNORE INTO kas_saldo (id, total_pemasukan, total_pengeluaran, saldo_akhir) VALUES (1, 0, 0, 0);
        ");

        DB::unprepared("DROP TRIGGER IF EXISTS tr_kas_insert;");
        DB::unprepared("DROP TRIGGER IF EXISTS tr_kas_update;");
        DB::unprepared("DROP TRIGGER IF EXISTS tr_kas_delete;");

        DB::unprepared("
            CREATE TRIGGER tr_kas_insert
            AFTER INSERT ON kas_transactions
            FOR EACH ROW
            BEGIN
                IF NEW.type = 'pemasukan' THEN
                    UPDATE kas_saldo SET 
                        total_pemasukan = total_pemasukan + NEW.nominal,
                        saldo_akhir = saldo_akhir + NEW.nominal
                    WHERE id = 1;
                ELSEIF NEW.type = 'pengeluaran' THEN
                    UPDATE kas_saldo SET 
                        total_pengeluaran = total_pengeluaran + NEW.nominal,
                        saldo_akhir = saldo_akhir - NEW.nominal
                    WHERE id = 1;
                END IF;
            END
        ");

        DB::unprepared("
            CREATE TRIGGER tr_kas_update
            AFTER UPDATE ON kas_transactions
            FOR EACH ROW
            BEGIN
                IF OLD.type = 'pemasukan' THEN
                    UPDATE kas_saldo SET 
                        total_pemasukan = total_pemasukan - OLD.nominal,
                        saldo_akhir = saldo_akhir - OLD.nominal
                    WHERE id = 1;
                ELSEIF OLD.type = 'pengeluaran' THEN
                    UPDATE kas_saldo SET 
                        total_pengeluaran = total_pengeluaran - OLD.nominal,
                        saldo_akhir = saldo_akhir + OLD.nominal
                    WHERE id = 1;
                END IF;

                IF NEW.type = 'pemasukan' THEN
                    UPDATE kas_saldo SET 
                        total_pemasukan = total_pemasukan + NEW.nominal,
                        saldo_akhir = saldo_akhir + NEW.nominal
                    WHERE id = 1;
                ELSEIF NEW.type = 'pengeluaran' THEN
                    UPDATE kas_saldo SET 
                        total_pengeluaran = total_pengeluaran + NEW.nominal,
                        saldo_akhir = saldo_akhir - NEW.nominal
                    WHERE id = 1;
                END IF;
            END
        ");

        DB::unprepared("
            CREATE TRIGGER tr_kas_delete
            AFTER DELETE ON kas_transactions
            FOR EACH ROW
            BEGIN
                IF OLD.type = 'pemasukan' THEN
                    UPDATE kas_saldo SET 
                        total_pemasukan = total_pemasukan - OLD.nominal,
                        saldo_akhir = saldo_akhir - OLD.nominal
                    WHERE id = 1;
                ELSEIF OLD.type = 'pengeluaran' THEN
                    UPDATE kas_saldo SET 
                        total_pengeluaran = total_pengeluaran - OLD.nominal,
                        saldo_akhir = saldo_akhir + OLD.nominal
                    WHERE id = 1;
                END IF;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP TRIGGER IF EXISTS tr_kas_insert;");
        DB::unprepared("DROP TRIGGER IF EXISTS tr_kas_update;");
        DB::unprepared("DROP TRIGGER IF EXISTS tr_kas_delete;");
        Schema::dropIfExists('kas_saldo');
    }
};
