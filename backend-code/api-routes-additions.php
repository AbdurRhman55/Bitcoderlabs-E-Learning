<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes for Admin & Profile
|--------------------------------------------------------------------------
|
| Add these routes to your routes/api.php file.
| These routes MUST be placed within the middleware('auth:sanctum') group.
|
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // Admin User Management
    // Add these before any generic /users/{id} routes to ensure they match first
    Route::post('/users/{id}/approve', [UserController::class, 'approve']);
    Route::post('/users/{id}/reject', [UserController::class, 'reject']);
    
    // Standard User Routes
    Route::get('/users', [UserController::class, 'index']); // Get all users
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    // Profile update endpoint (for the logged in user themselves)
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile', [ProfileController::class, 'update']);
});
