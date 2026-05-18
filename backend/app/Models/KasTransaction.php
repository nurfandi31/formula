<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['label', 'nominal', 'type', 'tanggal'])]
class KasTransaction extends Model
{
}
