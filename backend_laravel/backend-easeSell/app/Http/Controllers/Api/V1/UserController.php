<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'address' => 'required|string',
                'phone_number' => 'required|string|unique:users,phone_number',
            ]);

            $data['password'] = Hash::make($data['password']);

            $user = User::create($data);
            return response()->json(['message' => 'Cuenta creada con éxito', 'user' => $user], 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Error de validación', 'message' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear la cuenta', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::user();

            // Validar los datos de entrada
            $data = $request->validate([
                'name' => 'sometimes|required|string',
                'address' => 'sometimes|required|string',
            ]);

            // Actualizar los campos proporcionados
            $user->update($data);

            // Retorna la respuesta con el token incluido en los encabezados
            return response()->json([
                'message' => 'Usuario actualizado con éxito',
                'user' => $user,
                'access_token' => auth()->tokenById($user->id),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Error de validación', 'message' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el usuario', 'message' => $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }
}
