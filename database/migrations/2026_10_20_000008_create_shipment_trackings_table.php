<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipment_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->index()->constrained('shipping_providers')->restrictOnDelete();
            $table->string('tracking_number', 80)->unique();
            $table->boolean('is_primary')->default(false);
            $table->timestamp('added_at');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['shipment_id', 'is_primary']);
        });

        DB::statement('CREATE UNIQUE INDEX shipment_trackings_primary_unique ON shipment_trackings (shipment_id) WHERE is_primary = true');
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_trackings');
    }
};
