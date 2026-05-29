<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use Illuminate\Http\Request;

class GenerationController extends Controller
{
    public function index()
    {
        return response()->json(Generation::orderBy('num', 'asc')->get());
    }

    public function store(Request $request)
    {
        $id = $request->input('id');
        
        $rules = [
            'num' => 'required|integer|unique:generations,num,' . ($id ?: 'NULL'),
            'year' => 'required|string',
            'leader' => 'required|string',
            'secretary' => 'required|string',
            'treasurer' => 'required|string',
            'active_members' => 'nullable|array',
            'story' => 'required|string',
        ];

        $data = $request->validate($rules);

        if ($id) {
            $generation = Generation::findOrFail($id);
            $generation->update($data);
        } else {
            $generation = Generation::create($data);
        }

        return response()->json([
            'success' => true,
            'generation' => $generation
        ]);
    }

    public function destroy($id)
    {
        $generation = Generation::findOrFail($id);
        $generation->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
