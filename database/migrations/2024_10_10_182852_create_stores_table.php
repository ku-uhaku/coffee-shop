<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('description');
            $table->string('image');
            $table->string('status');
            $table->string('type');
            $table->string('address');
            $table->string('city');
            $table->string('country');
            $table->string('zip');
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email');
            $table->string('website')->nullable();
            $table->json('social_media')->nullable();
            $table->string('time_zone')->nullable();
            $table->string('currency');
            $table->string('currency_symbol');
            $table->string('currency_placement')->default('before');
            $table->string('thousand_separator')->default(',');
            $table->string('decimal_separator')->default('.');
            $table->string('date_format')->default('d-m-Y');
            $table->string('time_format')->default('H:i:s');
            $table->integer('no_of_decimals')->default(2);
            $table->json('gsts_numbers')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
