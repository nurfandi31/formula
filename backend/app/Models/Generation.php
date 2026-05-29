<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Generation extends Model
{
    protected $fillable = [
        'num',
        'year',
        'leader',
        'secretary',
        'treasurer',
        'active_members',
        'story'
    ];

    protected $casts = [
        'active_members' => 'array',
        'num' => 'integer'
    ];
}
