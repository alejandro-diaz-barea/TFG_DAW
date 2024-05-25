<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'IDChat',
        'contain',
        'timestamp',
        'view',
    ];

    protected $attributes = [
        'view' => false, // Establecer un valor predeterminado para el campo 'view'
    ];

    public function chat()
    {
        return $this->belongsTo(Chat::class, 'IDChat');
    }
}
