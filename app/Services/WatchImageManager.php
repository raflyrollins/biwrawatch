<?php

namespace App\Services;

use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class WatchImageManager
{
    /**
     * @param  array<int, UploadedFile>  $files
     */
    public function store(Watch $watch, array $files, ?string $alt = null): void
    {
        $sortOrder = (int) $watch->images()->max('sort_order');

        foreach ($files as $file) {
            $path = $file->store('watches', 'public');

            if ($path === false) {
                continue;
            }

            $watch->images()->create([
                'path' => $path,
                'alt' => $alt ?? $watch->brand.' '.$watch->model,
                'sort_order' => ++$sortOrder,
            ]);
        }
    }

    public function delete(WatchImage $image): void
    {
        if (! str_starts_with($image->path, '/') && ! str_starts_with($image->path, 'http')) {
            Storage::disk('public')->delete($image->path);
        }

        $image->delete();
    }

    public function deleteAll(Watch $watch): void
    {
        $watch->images()->get()->each(fn (WatchImage $image) => $this->delete($image));
    }
}
