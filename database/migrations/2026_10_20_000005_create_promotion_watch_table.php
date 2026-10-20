<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotion_watch', function (Blueprint $table) {
            $table->foreignId('promotion_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('watch_id')->index()->constrained()->cascadeOnDelete();
            $table->primary(['promotion_id', 'watch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_watch');
    }
};
