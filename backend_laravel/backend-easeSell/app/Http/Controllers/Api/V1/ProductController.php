<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // Paginación y búsqueda de productos
    public function index(Request $request)
    {
        $search = $request->input('search');
        $orderBy = $request->input('orderby');
        $categories = $request->input('categories', []);

        $query = Product::query()->with('categories');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($orderBy === 'price') {
            $query->orderBy('price', 'asc');
        } elseif ($orderBy === 'title') {
            $query->orderBy('name', 'asc');
        }

        if (!empty($categories)) {
            $query->whereHas('categories', function ($query) use ($categories) {
                $query->whereIn('category_id', $categories);
            });
        }

        $products = $query->paginate(8);

        if ($products->isEmpty()) {
            return response()->json(['message' => 'No se encontraron productos con los criterios de búsqueda especificados.'], 404);
        }

        return response()->json([
            'data' => $products,
            'total_pages' => $products->lastPage()
        ]);
    }

    // Obtener productos de un usuario específico
    public function getUserProducts(Request $request)
    {
        // Obtener el ID del usuario autenticado
        $userId = auth()->id();

        // Obtener los productos del usuario
        $products = Product::where('seller_id', $userId)->get();

        if ($products->isEmpty()) {
            return response()->json(['message' => 'El usuario no tiene productos asociados.'], 404);
        }

        return response()->json(['data' => $products]);
    }




    // Crear producto
    public function store(Request $request)
    {
        // Obtener el ID del usuario autenticado
        $sellerId = auth()->id();

        // Validar los datos de la solicitud
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'categories' => 'required|array',
        ]);

        // Crear el nuevo producto en la base de datos sin imágenes
        $product = Product::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'seller_id' => $sellerId,
            'date' => DB::raw('CURRENT_TIMESTAMP'),
            'image_path' => '', // Inicializar como un string vacío temporalmente
        ]);

        $imagePaths = [];

        // Guardar cada imagen en una subcarpeta del producto
        foreach ($request->file('images') as $image) {
            // Crear una subcarpeta descriptiva para cada producto
            $productImageFolder = 'public/product_images/' . $product->id . '_' . Str::slug($product->name);
            $imageName = time() . '_' . $image->getClientOriginalName();
            $path = $image->storeAs($productImageFolder, $imageName);
            $imagePaths[] = Storage::url($path); // Obtener la URL pública
        }

        // Actualizar el producto con las rutas de las imágenes
        $product->image_path = json_encode($imagePaths); // Guardar las rutas como un JSON
        $product->save();

        // Asociar las categorías al producto
        $categories = $request->input('categories');
        foreach ($categories as $categoryName) {
            // Crear la categoría si no existe
            $category = Category::firstOrCreate(['CategoryName' => $categoryName]);

            // Asociar la categoría al producto
            ProductCategory::create([
                'product_id' => $product->id,
                'category_id' => $category->id,
            ]);
        }

        return response()->json($product, 201);
    }

    // Mostrar producto
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // Actualizar producto
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product, 200);
    }

    // Eliminar producto
    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json(null, 204);
    }

    // Cargar imágenes adicionales
    public function uploadImage(Request $request, $id)
    {
        // Validar que el producto exista
        $product = Product::findOrFail($id);

        // Validar que se haya enviado una imagen en la solicitud
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePaths = json_decode($product->image_path, true);

        // Guardar cada imagen en una subcarpeta del producto
        foreach ($request->file('images') as $image) {
            $productImageFolder = 'public/product_images/' . $product->id . '_' . Str::slug($product->name);
            $imageName = time() . '_' . $image->getClientOriginalName();
            $path = $image->storeAs($productImageFolder, $imageName);
            $imagePaths[] = Storage::url($path);
        }

        // Actualizar el producto con las nuevas rutas de las imágenes
        $product->image_path = json_encode($imagePaths);
        $product->save();

        return response()->json(['message' => 'Imágenes cargadas con éxito']);
    }
}
