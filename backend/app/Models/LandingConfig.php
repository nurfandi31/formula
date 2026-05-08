<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['hero_title', 'hero_subtitle', 'sejarah'])]
class LandingConfig extends Model
{
}
