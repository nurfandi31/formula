<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['title', 'date', 'type', 'decisions', 'passcode', 'status'])]
class Activity extends Model
{
    protected function casts(): array
    {
        return [
            'decisions' => 'array'
        ];
    }
}
