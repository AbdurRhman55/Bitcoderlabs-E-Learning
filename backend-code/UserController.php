<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Get all users.
     */
    public function index(Request $request)
    {
        // Only admins can see user list
        if (strtolower($request->user()->role) !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::all();
        return response()->json(['data' => $users], 200);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $currentUser = $request->user();
        // Standard check: Admin can update anyone, others only themselves
        if (strtolower($currentUser->role) !== 'admin' && $currentUser->id !== $user->id) {
            return response()->json(['message' => 'This action is unauthorized.'], 403);
        }

        // Validate the incoming request
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'role' => ['sometimes', 'string', 'in:admin,instructor,student'],
            'is_active' => ['sometimes', 'boolean'],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Only admins can change roles or activation status
        if (strtolower($currentUser->role) !== 'admin') {
            unset($validated['role']);
            unset($validated['is_active']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->refresh()
        ], 200);
    }

    /**
     * Approve a student/user (Admin Only).
     */
    public function approve(Request $request, $id)
    {
        // Explicit Admin Check (Case-Insensitive)
        if (strtolower($request->user()->role) !== 'admin') {
            Log::warning("Unauthorized approval attempt by user: " . $request->user()->id . " with role: " . $request->user()->role);
            return response()->json(['message' => 'This action is unauthorized.'], 403);
        }

        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);

        return response()->json([
            'message' => 'User approved successfully',
            'user' => $user->refresh()
        ], 200);
    }

    /**
     * Reject/Delete a student/user (Admin Only).
     */
    public function reject(Request $request, $id)
    {
        // Explicit Admin Check (Case-Insensitive)
        if (strtolower($request->user()->role) !== 'admin') {
            Log::warning("Unauthorized rejection attempt by user: " . $request->user()->id);
            return response()->json(['message' => 'This action is unauthorized.'], 403);
        }

        $user = User::findOrFail($id);
        
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account here.'], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User rejected/deleted successfully'
        ], 200);
    }

    /**
     * Standard Delete (Admin Only).
     */
    public function destroy(Request $request, $id)
    {
        return $this->reject($request, $id);
    }
}
