<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'state',
        'date',
        'IDSeller',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'IDSeller');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories', 'IDProduct', 'IDCategory');
    }
}
