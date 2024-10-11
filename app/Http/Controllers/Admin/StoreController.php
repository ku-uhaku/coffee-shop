<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Store;

class StoreController extends Controller
{
    public function index()
    {
        $store = Store::first();
        
        return Inertia::render('Admin/Store/index', [
            'store' => $store,
        ]);
    }

    public function getSocialMediaLinks()
    {
        $store = Store::first();
        return response()->json($store->social_media);
    }

    public function updateSocialMediaLinks(Request $request)
    {
        $store = Store::first();

        $store->social_media = $request->socialMediaLinks;
        
        if($store->save()){
            return to_route('admin.store')->with('success', 'Social media links updated successfully');
        }else{
            return to_route('admin.store')->with('error', 'Social media links update failed');
        }
    }

    public function updateGstInfo(Request $request)
    {
        $store = Store::first();

        $validated = $request->validate([
            'name' => 'string',
            'number' => 'string|size:15|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
        ]);

        $store->gsts_numbers = $request->gstsNumbers;
        
        if ($store->save()) {
            return to_route('admin.store')->with('success', 'GST information updated successfully');
        } else {
            return to_route('admin.store')->with('error', 'GST information update failed');
        }
    }
}
