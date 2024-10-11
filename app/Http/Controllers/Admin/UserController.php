<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{


    public function users(Request $request)
    {
        $pageSize = $request->input('pageSize', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $sort = json_decode($request->input('sort', '[]'), true);
        $authUser = Auth::user();

        $allUsers = User::count();

        $query = User::query()
            ->when($search, function ($query, $search) {
                return $query->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });

        if (!empty($sort)) {
            foreach ($sort as $sortItem) {
                $query->orderBy($sortItem['id'], $sortItem['desc'] ? 'desc' : 'asc');
            }
        }

        $users = $query->paginate($pageSize, ['*'], 'page', $page);
        $userItems = $users->items();

        // Move the authenticated user to the beginning of the list
        if ($authUser) {
            $authUserKey = array_search($authUser->id, array_column($userItems, 'id'));
            if ($authUserKey !== false) {
                $authUserItem = $userItems[$authUserKey];
                unset($userItems[$authUserKey]);
                array_unshift($userItems, $authUserItem);
            }
        }

        $data = [
            'users' => $userItems,
            'allUsers' => $allUsers,
            'total' => $users->total(),
            'currentPage' => $users->currentPage(),
            'lastPage' => $users->lastPage(),
        ];

        return Inertia::render('Admin/Users/index', array_merge($data, [
            'pageSize' => $pageSize,
            'search' => $search,
            'sort' => $sort,
        ]));
    }

    public function createUser()
    {
        return Inertia::render('Admin/Users/create');
    }

    public function storeUser(Request $request)
    {
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $timestamp = time();
            $extension = $avatar->getClientOriginalExtension();
            $filename = $timestamp . '.' . $extension;
            $avatarPath = $avatar->storeAs('avatars', $filename, 'public');
        } else {
            $avatarPath = 'avatars/default/' . $request->gender . '.png';
        }

        $request->validate([
            'avatar' => ['image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'username' => ['required', 'max:50'],
            'user_code' => ['required', 'max:50'],
            'first_name' => ['required', 'max:50'],
            'last_name' => ['required', 'max:50'],
            'phone' => ['max:50'],
            'email' => ['required', 'max:50', 'email'],
            'password' => ['required', 'max:50'],
            'gender' => ['required', 'max:50', 'in:male,female'],
            'confirm_password' => ['required', 'max:50', 'same:password'],
        ]);

        $user = new User();
        $user->avatar = $avatarPath;
        $user->username = $request->username;
        $user->user_code = $request->user_code;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->phone = $request->phone;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->gender = $request->gender;
        $user->address = $request->address;
        $user->city = $request->city;
        $user->save();

        if ($user) {
            return to_route('admin.users')
                ->with('success', 'User created successfully')
                ->with('sound', 'create');
        } else {
            return to_route('admin.users')->with('error', 'User created failed');
        }
    }

    public function bulkDeleteUsers(Request $request)
    {

        $ids = $request->input('ids', []);

        if (in_array(Auth::user()->id, $ids)) {
            return back()->with('error', 'You cannot delete your own account');
        }
        $deletedCount = User::whereIn('id', $ids)->delete();
        if ($deletedCount) {
            return back()->with('success', $deletedCount . ' users deleted successfully');
        } else {
            return back()->with('error', 'Users deleted failed');
        }
    }

    public function updateUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->status = $request->input('status');
        $user->save();
        if ($user) {
            return back()->with('success', 'User status updated successfully ' . $user->status);
        } else {
            return back()->with('error', 'User status updated failed');
        }
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === Auth::user()->id) {

            return back()->with('error', 'You cannot delete your own account');
        }
        $user->delete();
        if ($user) {
            return back()->with('success', 'User deleted successfully');
        } else {
            return back()->with('error', 'User deleted failed');
        }
    }
}
