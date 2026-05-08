<?php

namespace App\Http\Controllers;

use App\Models\KasTransaction;
use Illuminate\Http\Request;

class KasController extends Controller
{
    public function index()
    {
        $riwayat = KasTransaction::orderBy('id', 'desc')->get();
        $pemasukan = KasTransaction::where('type', 'pemasukan')->sum('nominal');
        $pengeluaran = KasTransaction::where('type', 'pengeluaran')->sum('nominal');
        $saldo = $pemasukan - $pengeluaran;

        return response()->json([
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'saldo' => $saldo,
            'riwayat' => $riwayat
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required',
            'nominal' => 'required|numeric',
            'type' => 'required',
            'icon' => 'required',
            'tanggal' => 'required'
        ]);

        $tx = KasTransaction::create($data);

        return response()->json([
            'success' => true,
            'transaction' => $tx
        ]);
    }

    public function destroy($id)
    {
        $tx = KasTransaction::findOrFail($id);
        $tx->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
