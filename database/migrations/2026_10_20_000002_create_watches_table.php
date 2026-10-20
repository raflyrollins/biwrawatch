<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('watches', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('brand', 80);
            $table->string('model', 120);
            $table->string('reference_number', 80)->unique();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('movement', 80)->nullable();
            $table->string('case_material', 80)->nullable();
            $table->decimal('case_diameter_mm', 5, 2)->nullable();
            $table->string('dial_color', 60)->nullable();
            $table->string('strap_material', 80)->nullable();
            $table->string('condition', 30)->default('pre_owned');
            $table->text('description')->nullable();
            $table->text('search_keywords')->nullable();
            $table->unsignedBigInteger('price')->default(0);
            $table->string('status', 30)->default('available');
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'status']);
            $table->index(['is_featured', 'sort_order']);
            $table->index('brand');
            $table->index('condition');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE watches
            ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
                setweight(to_tsvector('indonesian', coalesce(brand, '') || ' ' || coalesce(model, '')), 'A') ||
                setweight(to_tsvector('indonesian', coalesce(reference_number, '')), 'B') ||
                setweight(to_tsvector('indonesian', coalesce(description, '') || ' ' || coalesce(search_keywords, '')), 'C')
            ) STORED
        SQL);

        DB::statement('CREATE INDEX watches_search_vector_index ON watches USING GIN (search_vector)');
    }

    public function down(): void
    {
        Schema::dropIfExists('watches');
    }
};
