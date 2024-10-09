<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        // $table->id();
        // $table->string('user_code')->unique();

        // $table->string('first_name');
        // $table->string('last_name');
        // $table->string('username')->unique();
        // $table->string('avatar')->nullable();
        // $table->string('address')->nullable();
        // $table->string('city')->nullable();
        // $table->string('state')->nullable();
        // $table->string('zip')->nullable();
        // $table->string('country')->nullable();
        // $table->string('phone')->nullable();
        // $table->string('gender')->nullable();
        // $table->string('email')->unique();
        // $table->string('status')->default('pending');
        // $table->string('deleted_by')->nullable();
        // $table->timestamp('email_verified_at')->nullable();
        // $table->string('password');
        // $table->rememberToken();
        // $table->timestamps();
        // $table->softDeletes();
        return [
            'user_code' => Str::uuid(),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'username' => $this->faker->unique()->userName,
            'avatar' => "avatars/1728497996.svg",
            'address' => $this->faker->address,
            'city' => $this->faker->city,
            'state' => $this->faker->state,
            'zip' => $this->faker->postcode,
            'country' => $this->faker->country, 
            'phone' => $this->faker->phoneNumber,
            'gender' => $this->faker->randomElement(['male', 'female']),
            'email' => $this->faker->unique()->safeEmail,
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
