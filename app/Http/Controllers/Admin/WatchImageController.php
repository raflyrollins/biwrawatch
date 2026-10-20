<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Watch;
use App\Models\WatchImage;
use App\Services\WatchImageManager;
use Illuminate\Http\RedirectResponse;

class WatchImageController extends Controller
{
    public function destroy(
        Watch $watch,
        WatchImage $image,
        WatchImageManager $manager,
    ): RedirectResponse {
        abort_unless($image->watch_id === $watch->id, 404);

        $manager->delete($image);

        return back()->with('success', __('admin.flash.image_deleted'));
    }
}
