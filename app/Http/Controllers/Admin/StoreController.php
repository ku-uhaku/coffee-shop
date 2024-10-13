<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Store;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
class StoreController extends Controller
{
    public function index()
    {
        $store = Store::first();
        $gstNumbers = json_decode($store->gsts_numbers, true) ?? [];
        $socialMedia = json_decode($store->social_media, true) ?? [];
        $baseUrl = url('/');
        $image = $store->image ;
    
        return Inertia::render('Admin/Store/index', [
            'store' => $store,
            'gstNumbers' => $gstNumbers,
            'socialMedia' => $socialMedia,
            'image' => $image,
        ]);
    }

    public function updateGstInfo(Request $request)
    {
        $store = Store::first();
        $validated = $request->validate([
            'gstInfo' => 'required|json',
        ]);
        $gstInfo = json_decode($request->gstInfo, true);
        // Validate the decoded JSON data
        $validator = Validator::make($gstInfo, [
            'name' => 'required|string',
            'number' => 'required',
            'showInInvoice' => 'boolean',
        ]); 
        if ($validator->fails()) {
            return to_route('admin.store')->with('error', 'GST information update failed');
        }
        $existingGstInfo = is_string($store->gsts_numbers) ? json_decode($store->gsts_numbers, true) : [];
        $existingGstInfo[] = $gstInfo;
        $store->gsts_numbers = json_encode($existingGstInfo);       
        if ($store->save()) {
            return to_route('admin.store')->with('success', 'GST information updated successfully')->with('sound', 'create');
        } else {
            return to_route('admin.store')->with('error', 'GST information update failed');
        }
    }

    public function updateSocialMedia(Request $request)
    {
        $store = Store::first();

        $validated = $request->validate([
            'socialMedia' => 'required|json',
        ]);

        $socialMedia = json_decode($request->socialMedia, true);

        // Validate the decoded JSON data
        $validator = Validator::make($socialMedia, [
            'platform' => 'required|string',
            'url' => 'required|url',
          
        ]);

        if ($validator->fails()) {
            return to_route('admin.store')->with('error', 'Social media update failed');
        }

        $existingSocialMedia = is_string($store->social_media) ? json_decode($store->social_media, true) : [];

        $existingSocialMedia[] = $socialMedia;

        $store->social_media = json_encode($existingSocialMedia);

        if ($store->save()) {
            return to_route('admin.store')->with('success', 'Social media updated successfully')->with('sound', 'create');
        } else {
            return to_route('admin.store')->with('error', 'Social media update failed');
        }
    }

    public function update(Request $request)
    {

        // dd($request->all());
        $store = Store::first();

       

        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:png,gif|max:2048',
            // 'status' => 'required|in:active,inactive',
            // 'type' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'zip' => 'required|string',
            'phone' => 'nullable|string',
            'mobile' => 'nullable|string',
            'email' => 'required|email',
            'website' => 'nullable|url',
            'social_media' => 'nullable|json',
            'time_zone' => 'required|string',
            'currency' => 'required|string',
            'currency_symbol' => 'required|string',
            'currency_placement' => 'required|in:before,after',
            'thousand_separator' => 'required|string|max:1',
            'decimal_separator' => 'required|string|max:1',
            'date_format' => 'required|string',
            'time_format' => 'required|string',
            'no_of_decimals' => 'integer|min:0|max:4',
            'gsts_numbers' => 'nullable|json',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($store->image) {
                Storage::disk('public')->delete($store->image);
            }
            $imagePath = $request->file('image')->store('store_images', 'public');
            $store->image = $imagePath;
        }

        $store->name = $request->name;
        $store->slug = $request->slug;
        $store->description = $request->description;
        $store->address = $request->address;
        $store->city = $request->city;
        $store->country = $request->country;
        $store->zip = $request->zip;
        $store->phone = $request->phone;
        $store->mobile = $request->mobile;
        $store->email = $request->email;
        $store->website = $request->website;
        $store->social_media = $request->social_media;
        $store->time_zone = $request->time_zone;
        $store->currency = $request->currency;
        $store->currency_symbol = $request->currency_symbol;
        $store->currency_placement = $request->currency_placement;
        $store->thousand_separator = $request->thousand_separator;
        $store->decimal_separator = $request->decimal_separator;
        $store->date_format = $request->date_format;
        $store->time_format = $request->time_format;
        $store->no_of_decimals = $request->no_of_decimals;
        $store->gsts_numbers = $request->gsts_numbers;

        if ($store->save()) {
            return redirect()->route('admin.store')->with('success', 'Store updated successfully')->with('sound', 'create');
        } else {
            return redirect()->route('admin.store')->with('error', 'Store update failed');
        }
    }
}
