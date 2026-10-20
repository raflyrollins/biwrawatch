<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('tracking_number', 32)->unique();
            $table->string('recipient_name', 120);
            $table->string('recipient_phone', 32);
            $table->string('recipient_phone_normalized', 32)->index();
            $table->text('recipient_address');
            $table->string('destination_city', 120);
            $table->string('destination_country', 80)->default('Indonesia');
            $table->string('status', 30)->default('pending');
            $table->date('estimated_delivery_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('last_status_at')->nullable();
            $table->text('internal_notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'last_status_at']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
