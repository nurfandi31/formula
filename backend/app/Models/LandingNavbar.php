<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingNavbar extends Model
{
    protected $fillable = [
        'label',
        'url_path',
        'order_index',
        'is_active',
    ];
}
