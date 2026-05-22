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

    public function yearlyReport()
    {
        $transactions = KasTransaction::orderBy('id', 'asc')->get();
        $yearlyData = [];

        foreach ($transactions as $tx) {
            if (preg_match('/(19|20)\d{2}/', $tx->tanggal, $matches)) {
                $year = (int)$matches[0];
            } else {
                $year = (int)date('Y', strtotime($tx->tanggal));
            }

            if (!isset($yearlyData[$year])) {
                $yearlyData[$year] = [
                    'year' => $year,
                    'pemasukan' => 0,
                    'pengeluaran' => 0
                ];
            }

            if ($tx->type === 'pemasukan') {
                $yearlyData[$year]['pemasukan'] += $tx->nominal;
            } else {
                $yearlyData[$year]['pengeluaran'] += $tx->nominal;
            }
        }

        ksort($yearlyData);

        $reports = [];
        $runningBalance = 0;

        foreach ($yearlyData as $year => $data) {
            $startingBalance = $runningBalance;
            $net = $data['pemasukan'] - $data['pengeluaran'];
            $runningBalance += $net;

            $reports[] = [
                'year' => $year,
                'starting_balance' => (float)$startingBalance,
                'pemasukan' => (float)$data['pemasukan'],
                'pengeluaran' => (float)$data['pengeluaran'],
                'saldo_tahunan' => (float)$net,
                'ending_balance' => (float)$runningBalance
            ];
        }

        usort($reports, function($a, $b) {
            return $b['year'] <=> $a['year'];
        });

        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required',
            'nominal' => 'required|numeric',
            'type' => 'required',
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
