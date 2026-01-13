<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Update the specified user.
     * This method now includes authorization check via UserPolicy.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Authorize the update action (uses UserPolicy)
        $this->authorize('update', $user);

        // Validate the incoming request
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'role' => ['sometimes', 'string', 'in:admin,instructor,student'],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'current_password' => ['required_with:password'],
        ]);

        // If password is being updated
        if (isset($validated['password'])) {
            // For self-updates, verify current password
            if ($request->user()->id === $user->id) {
                if (!isset($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                    return response()->json([
                        'message' => 'Current password is incorrect'
                    ], 422);
                }
            }

            // Hash the new password
            $validated['password'] = Hash::make($validated['password']);
            unset($validated['current_password']);
        }

        // Only admins can change roles
        if (isset($validated['role']) && $request->user()->role !== 'admin') {
            unset($validated['role']);
        }

        // Update the user
        $user->update($validated);
        $user->refresh();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ], 200);
    }
}
