<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = ['social_media', 'gsts_numbers'];

    protected $casts = [
        'social_media' => 'array',
        'gsts_numbers' => 'array',
    ];
}
