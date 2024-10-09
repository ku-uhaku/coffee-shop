<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/index');
    }

    public function users()
    {
        $users = User::all();
        return Inertia::render('Admin/Users/index', compact('users'));
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
            $avatarPath = null;
        }

        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
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

        return to_route('admin.users');
    }
}
