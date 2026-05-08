<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['activity_name', 'user_email', 'status'])]
class Attendance extends Model
{
}
