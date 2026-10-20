<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name', 120);
            $table->string('label', 60)->nullable();
            $table->text('description')->nullable();
            $table->string('discount_type', 20)->nullable();
            $table->unsignedBigInteger('discount_value')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('applies_to_all')->default(false);
            $table->integer('priority')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'starts_at', 'ends_at']);
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
