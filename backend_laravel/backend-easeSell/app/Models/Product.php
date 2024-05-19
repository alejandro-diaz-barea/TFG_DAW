<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'price', 'seller_id', 'date', 'image_path'
    ];

    protected $casts = [
        'image_path' => 'array',
    ];
}
