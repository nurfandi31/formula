<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingSection extends Model
{
    protected $fillable = [
        'key',
        'title',
        'subtitle',
        'order_index',
        'is_active',
        'content',
        'style_configs',
    ];

    protected $casts = [
        'content' => 'array',
        'style_configs' => 'array',
    ];
}
