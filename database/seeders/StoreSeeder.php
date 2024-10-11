<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // $table->id();
    // $table->string('name');
    // $table->string('slug');
    // $table->string('description');
    // $table->string('image');
    // $table->string('status');
    // $table->string('type');
    // $table->string('address');
    // $table->string('city');
    // $table->string('country');
    // $table->string('zip');
    // $table->string('phone')->nullable();
    // $table->string('mobile')->nullable();
    // $table->string('email');
    // $table->string('website')->nullable();
    // $table->json('social_media')->nullable();
    // $table->string('time_zone')->nullable();
    // $table->string('currency');
    // $table->string('currency_symbol');
    // $table->string('currency_placement')->default('before');
    // $table->string('thousand_separator')->default(',');
    // $table->string('date_format')->default('d-m-Y');
    // $table->string('time_format')->default('H:i:s');
    // $table->string('decimal_separator')->default('.');
    // $table->integer('no_of_decimals')->default(2);
    // $table->json('doc')->nullable();
    public function run(): void
    {
        Store::create([
                'name' => 'Default Store',
                'image' => 'default.jpg',
                'slug' => 'default-store',
                'description' => 'Default Description',
                'status' => 'active',
                'type' => 'physical',
                'phone' => '1234567890',
                'mobile' => '1234567890',
                'address' => 'Default Address',
                'city' => 'Default City',
                'country' => 'Default Country',
                'zip' => 'Default Zip',
                'email' => 'default@example.com',
                'website' => 'https://default.com',
                'currency' => 'USD',
                'currency_symbol' => '$',
                'social_media' => json_encode([]),
                'no_of_decimals' => 2,
                'date_format' => 'd-m-Y',
                'time_format' => 'H:i:s',
                'thousand_separator' => ',',
                'gsts_numbers' => json_encode([]),
        ]);
    }
}
