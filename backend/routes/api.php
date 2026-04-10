<?php

/**
 * API Routes
 *
 * All routes defined here are prefixed with /api and assigned the "api" middleware group.
 * Authentication routes will be added in Step 2.
 */

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

/**
 * Health check endpoint.

 * Returns API status and current Laravel version.
 */
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app'    => config('app.name'),
        'version' => app()->version(),
    ]);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    /**
     * Get the currently authenticated user.
     */
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('products', \App\Http\Controllers\ProductController::class);
});
