<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Store;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    public function index()
    {
        $store = Store::first();
        $gstNumbers = json_decode($store->gsts_numbers, true) ?? [];
        
        return Inertia::render('Admin/Store/index', [
            'store' => $store,
            'gstNumbers' => $gstNumbers,
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

    public function deleteGstNumber(Request $request)
    {
        $store = Store::first();
        $gstNumbers = json_decode($store->gsts_numbers, true) ?? [];

        $indexToDelete = $request->input('index');

        if (isset($gstNumbers[$indexToDelete])) {
            array_splice($gstNumbers, $indexToDelete, 1);
            $store->gsts_numbers = json_encode($gstNumbers);

            if ($store->save()) {
                return response()->json(['success' => true, 'message' => 'GST number deleted successfully']);
            }
        }

        return response()->json(['success' => false, 'message' => 'Failed to delete GST number'], 400);
    }
}
