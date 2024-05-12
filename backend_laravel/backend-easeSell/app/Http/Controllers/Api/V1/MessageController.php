<?php

namespace App\Http\Controllers\Api\V1;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the messages for a specific chat.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $chat_id = $request->input('chat_id');

        // Verificar si el ID del chat está presente en la solicitud
        if (!$chat_id) {
            return response()->json(['error' => 'Se requiere el ID del chat.'], 400);
        }

        // Obtener los mensajes del chat especificado
        $messages = Message::where('idchat', $chat_id)->get();
        return response()->json($messages);
    }

    /**
     * Display the specified message.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $message = Message::findOrFail($id);
        return response()->json($message);
    }

    /**
     * Store a newly created message in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $message = Message::create($request->all());
        return response()->json($message, 201);
    }

    /**
     * Update the specified message in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        $message->update($request->all());
        return response()->json($message, 200);
    }

    /**
     * Remove the specified message from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Message::destroy($id);
        return response()->json(null, 204);
    }
}
