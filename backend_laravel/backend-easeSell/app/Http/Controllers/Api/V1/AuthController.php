<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Verifica si las credenciales son válidas y si la contraseña es correcta
        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Obtiene el usuario autenticado
        $user = Auth::user();

        // Verifica si el usuario existe
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Si todo está bien, responde con el token y los detalles del usuario
        return $this->respondWithToken($token, $user);
    }

    /**
     * Check the validity of a token and return a new token with user info.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkToken(Request $request)
    {
        // Obtener el token del encabezado de la solicitud
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        try {
            // Intenta refrescar el token
            $newToken = auth()->refresh($token);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            // Si el token ha expirado, devuelve un error
            return response()->json(['error' => 'Token expired'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            // Si el token no es válido, devuelve un error
            return response()->json(['error' => 'Token invalid'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            // Si hay algún otro error JWT, devuelve un error
            return response()->json(['error' => 'Token error'], 500);
        }

        // Obtener el usuario asociado con el token
        $user = auth()->user();

        // Responder con el nuevo token y los detalles del usuario
        return $this->respondWithToken($newToken, $user);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     * @param \Illuminate\Contracts\Auth\Authenticatable|null $user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, Authenticatable $user = null)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'id' => optional($user)->id,
            'name' => optional($user)->name,
            'address'=> optional($user)->address,
            'email' => optional($user)->email,
            'phone' => optional($user)->phone,
        ]);
    }
}
