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
            'decisions' => 'nullable|array',
            'passcode' => 'nullable|string|max:6',
            'status' => 'nullable|string'
        ]);

        if (empty($data['passcode'])) {
            $data['passcode'] = strval(rand(1000, 9999));
        }
        if (empty($data['status'])) {
            $data['status'] = 'active';
        }

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
