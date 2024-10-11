<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\StoreController;
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
    return view("pages.admin.index");
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin
    // Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/users', [UserController::class, 'users'])->name('admin.users');
    Route::get('/admin/users/create', [UserController::class, 'createUser'])->name('admin.users.create');
    Route::post('/admin/users/store', [UserController::class, 'storeUser'])->name('admin.users.store');
    Route::post('/admin/users/edit/{id}', [UserController::class, 'editUser'])->name('admin.users.edit');
    Route::post('/admin/users/update/{id}', [UserController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('/admin/users/bulk-delete', [UserController::class, 'bulkDeleteUsers'])->name('admin.users.bulkDelete');
    Route::put('/admin/users/{id}/update-status', [UserController::class, 'updateUserStatus'])->name('admin.users.updateStatus');
    Route::delete('/admin/users/{id}', [UserController::class, 'deleteUser'])->name('admin.users.delete');

    // Stores
    Route::get('/admin/store', [StoreController::class, 'index'])->name('admin.store');
    Route::post('/admin/store/social-media-links', [StoreController::class, 'updateSocialMediaLinks'])->name('admin.store.updateSocialMediaLinks');
    Route::get('/store/social-media-links', [StoreController::class, 'getSocialMediaLinks'])->name('admin.store.getSocialMediaLinks');
    Route::post('/admin/store/gst-info', [StoreController::class, 'updateGstInfo'])->name('admin.store.updateGstInfo');

});

require __DIR__ . '/auth.php';
