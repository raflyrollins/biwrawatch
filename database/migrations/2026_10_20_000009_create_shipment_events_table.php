<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipment_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->index()->constrained()->cascadeOnDelete();
            $table->string('status', 30);
            $table->string('location', 160)->nullable();
            $table->text('note')->nullable();
            $table->boolean('is_public')->default(true);
            $table->timestamp('occurred_at');
            $table->foreignId('created_by')->nullable()->index()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['shipment_id', 'is_public', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_events');
    }
};
