<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([

            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'username' => 'admin',
            'user_code' => 'C01000000001',
            'avatar' => 'default-male.png',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'email_verified_at' => now(),
            'address' => 'Tamessena',
            'city' => 'Rabat',
            'state' => 'Rabat',
            'zip' => '10110',
            'country' => 'Morocco',
            'phone' => '0666666666',
            'gender' => 'male',
            'remember_token' => Str::random(10),

        ]);

        User::factory()->count(10)->create();

        $this->call([
            StoreSeeder::class,
        ]);
    }
}
