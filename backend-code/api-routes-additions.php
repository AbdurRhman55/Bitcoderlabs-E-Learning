<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes for Profile Updates
|--------------------------------------------------------------------------
|
| Add these routes to your routes/api.php file to enable student profile updates.
| These routes should be placed within your existing auth:sanctum middleware group.
|
*/

// OPTION 1: Dedicated Profile Endpoint (Recommended for students)
// Add this route to allow students to update their own profile
Route::middleware('auth:sanctum')->group(function () {
    // Profile update endpoint - any authenticated user can update their own profile
    Route::put('/profile', [ProfileController::class, 'update']);
    
    // Alternative: You can also use PATCH
    Route::patch('/profile', [ProfileController::class, 'update']);
});

// OPTION 2: Update existing /users/{id} route
// If you already have a users route, make sure it uses the UserController
// with proper authorization via UserPolicy
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::patch('/users/{id}', [UserController::class, 'update']);
});

// OPTION 3: Simple /me endpoint for self-updates
// This is the simplest approach - add this to your existing routes
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/me', function (Request $request) {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'current_password' => ['required_with:password'],
        ]);

        if (isset($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['message' => 'Current password is incorrect'], 422);
            }
            $validated['password'] = Hash::make($validated['password']);
            unset($validated['current_password']);
        }

        $user->update($validated);
        $user->refresh();

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    });
});
