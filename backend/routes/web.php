<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\MemberController;

Route::get('/', function () {
    return response()->json(['message' => 'FORMULA Backend API']);
});

Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/session', [AuthController::class, 'session']);

    Route::get('/landing', [LandingController::class, 'show']);
    Route::post('/landing', [LandingController::class, 'update']);

    Route::get('/kas', [KasController::class, 'index']);
    Route::post('/kas', [KasController::class, 'store']);
    Route::delete('/kas/{id}', [KasController::class, 'destroy']);

    Route::get('/activities', [ActivityController::class, 'index']);
    Route::post('/activities', [ActivityController::class, 'store']);
    Route::delete('/activities/{id}', [ActivityController::class, 'destroy']);

    Route::get('/attendance/{activity}', [AttendanceController::class, 'show']);
    Route::post('/attendance/{activity}', [AttendanceController::class, 'store']);

    Route::get('/members', [MemberController::class, 'index']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::put('/members/{id}', [MemberController::class, 'update']);
    Route::delete('/members/{id}', [MemberController::class, 'destroy']);
});
