<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function show($activityName)
    {
        $attendance = Attendance::where('activity_name', $activityName)->get()->pluck('status', 'user_email');
        return response()->json($attendance);
    }

    public function store(Request $request, $activityName)
    {
        $data = $request->validate([
            'attendance' => 'required|array'
        ]);

        foreach ($data['attendance'] as $email => $status) {
            Attendance::updateOrCreate(
                ['activity_name' => $activityName, 'user_email' => $email],
                ['status' => $status]
            );
        }

        return response()->json([
            'success' => true
        ]);
    }
}
