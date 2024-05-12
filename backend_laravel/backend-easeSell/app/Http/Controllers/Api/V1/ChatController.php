<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the chats.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
{
    // Obtener el ID del usuario autenticado
    $user_id = Auth::id();

    // Obtener los chats en los que participa el usuario autenticado
    $chats = Chat::where('idusuario1', $user_id)
                 ->orWhere('idusuario2', $user_id)
                 ->get();

    return response()->json($chats);
}

    /**
     * Display the specified chat.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $chat = Chat::findOrFail($id);
        return response()->json($chat);
    }

    /**
     * Store a newly created chat in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Obtener el ID del usuario autenticado
        $user1_id = Auth::id();

        // Validar los datos de la solicitud
        $request->validate([
            'user2_id' => 'required|exists:users,id',
        ]);

        // Verificar si ya existe un chat con los mismos usuarios
        $existingChat = Chat::where('idusuario1', $user1_id)
                            ->where('idusuario2', $request->user2_id)
                            ->orWhere(function ($query) use ($user1_id, $request) {
                                $query->where('idusuario1', $request->user2_id)
                                      ->where('idusuario2', $user1_id);
                            })
                            ->first();

        if ($existingChat) {
            // Si el chat ya existe, devolver un error
            return response()->json(['message' => 'Ya existe un chat entre estos usuarios.'], 422);
        }

        // Crear el nuevo chat con los datos proporcionados
        $chat = Chat::create([
            'idusuario1' => $user1_id,
            'idusuario2' => $request->user2_id,
        ]);

        // Devolver la respuesta con el chat creado y el código de estado 201 (Created)
        return response()->json($chat, 201);
    }

    /**
     * Update the specified chat in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $chat = Chat::findOrFail($id);
        $chat->update($request->all());
        return response()->json($chat, 200);
    }

    /**
     * Remove the specified chat from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Chat::destroy($id);
        return response()->json(null, 204);
    }
}
