<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        return response()->json(Activity::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'date' => 'required',
            'type' => 'required',
            'decisions' => 'nullable|array'
        ]);

        $activity = Activity::create($data);

        return response()->json([
            'success' => true,
            'activity' => $activity
        ]);
    }

    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);
        $activity->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
