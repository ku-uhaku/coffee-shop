<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/index');
    }

    public function users(Request $request)
    {
        $query = User::query();

        // Apply search filter if provided
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('username', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhere('user_code', 'like', "%{$searchTerm}%")
                    ->orWhere('first_name', 'like', "%{$searchTerm}%")
                    ->orWhere('last_name', 'like', "%{$searchTerm}%");
            });
        }

        $users = $query->paginate(10)->map(function ($user) {
            $user->avatar = $user->avatar ? Storage::url($user->avatar) : null;
            return $user;
        });

        $message = session('success');
        return Inertia::render('Admin/Users/index', compact('users', 'message'));
    }

    public function createUser()
    {
        return Inertia::render('Admin/Users/create');
    }

    public function storeUser(Request $request)
    {
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $timestamp = time();
            $extension = $avatar->getClientOriginalExtension();
            $filename = $timestamp . '.' . $extension;
            $avatarPath = $avatar->storeAs('avatars', $filename, 'public');
        } else {
            $avatarPath = 'avatars/default/' . $request->gender . '.png';
        }

        $request->validate([
            'avatar' => ['image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'username' => ['required', 'max:50'],
            'user_code' => ['required', 'max:50'],
            'first_name' => ['required', 'max:50'],
            'last_name' => ['required', 'max:50'],
            'phone' => ['max:50'],
            'email' => ['required', 'max:50', 'email'],
            'password' => ['required', 'max:50'],
            'gender' => ['required', 'max:50', 'in:male,female'],
            'confirm_password' => ['required', 'max:50', 'same:password'],
        ]);

        $user = new User();
        $user->avatar = $avatarPath;
        $user->username = $request->username;
        $user->user_code = $request->user_code;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->phone = $request->phone;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->gender = $request->gender;
        $user->address = $request->address;
        $user->city = $request->city;
        $user->save();

        return to_route('admin.users')->with('success', 'User created successfully');
    }
}
