<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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

    public function createUsers()
    {
        return Inertia::render('Admin/Users/create');
    }
}
