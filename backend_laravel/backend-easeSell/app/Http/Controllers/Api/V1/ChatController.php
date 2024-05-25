<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $user_id = Auth::id();

        $chats = Chat::with('user1', 'user2')
                     ->where('idusuario1', $user_id)
                     ->orWhere('idusuario2', $user_id)
                     ->get();

        return response()->json($chats);
    }


    public function show($id)
    {
        $chat = Chat::with('user1', 'user2')->findOrFail($id);
        return response()->json($chat);
    }

    public function store(Request $request)
    {
        $user1_id = Auth::id();

        $request->validate([
            'user2_id' => 'required|exists:users,id',
        ]);

        $existingChat = Chat::where('idusuario1', $user1_id)
                            ->where('idusuario2', $request->user2_id)
                            ->orWhere(function ($query) use ($user1_id, $request) {
                                $query->where('idusuario1', $request->user2_id)
                                      ->where('idusuario2', $user1_id);
                            })
                            ->first();

        if ($existingChat) {
            return response()->json(['message' => 'Ya existe un chat entre estos usuarios.'], 422);
        }

        $chat = Chat::create([
            'idusuario1' => $user1_id,
            'idusuario2' => $request->user2_id,
        ]);

        return response()->json($chat, 201);
    }

    public function update(Request $request, $id)
    {
        $chat = Chat::findOrFail($id);
        $chat->update($request->all());
        return response()->json($chat, 200);
    }

    public function destroy($id)
    {
        Chat::destroy($id);
        return response()->json(null, 204);
    }
}
