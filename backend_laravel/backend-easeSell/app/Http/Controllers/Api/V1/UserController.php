<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
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

            // Corrección: Hashear la contraseña usando la clase Hash
            $data['password'] = Hash::make($data['password']);

            $user = User::create($data);
            return response()->json(['message' => 'Cuenta creada con éxito', 'user' => $user], 201);
        } catch (ValidationException $e) {
            // Manejar errores de validación
            return response()->json(['error' => 'Error de validación', 'message' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            // Manejar otros errores
            return response()->json(['error' => 'Error al crear la cuenta', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user, 200);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }
}
