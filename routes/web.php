<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/admin/users/create', [AdminController::class, 'createUser'])->name('admin.users.create');
    Route::post('/admin/users/store', [AdminController::class, 'storeUser'])->name('admin.users.store');
    Route::post('/admin/users/edit/{id}', [AdminController::class, 'editUser'])->name('admin.users.edit');
    Route::post('/admin/users/update/{id}', [AdminController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('/admin/users/bulk-delete', [AdminController::class, 'bulkDeleteUsers'])->name('admin.users.bulkDelete');
    Route::put('/admin/users/{id}/update-status', [AdminController::class, 'updateUserStatus'])->name('admin.users.updateStatus');
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser'])->name('admin.users.delete');
});

require __DIR__ . '/auth.php';
