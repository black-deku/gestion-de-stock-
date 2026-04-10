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

    Route::get('/products/export/csv', [\App\Http\Controllers\ProductController::class, 'exportCsv']);
    Route::post('/products/import/csv', [\App\Http\Controllers\ProductController::class, 'importCsv']);
    Route::apiResource('products', \App\Http\Controllers\ProductController::class);
    Route::apiResource('stock-movements', \App\Http\Controllers\StockMovementController::class)->only(['index', 'store']);
    Route::apiResource('documents', \App\Http\Controllers\DocumentController::class)->except(['update', 'store']);
    Route::post('documents', [\App\Http\Controllers\DocumentController::class, 'store']); // Requires post for file uploads

    Route::get('/dashboard/stats', [\App\Http\Controllers\DashboardController::class, 'stats']);
});
