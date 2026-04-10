<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products|max:255',
            'description' => 'nullable|string',
            'quantity' => 'integer|min:0',
            'price' => 'numeric|min:0',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'sku' => 'sometimes|required|string|unique:products,sku,' . $product->id . '|max:255',
            'description' => 'nullable|string',
            'quantity' => 'integer|min:0',
            'price' => 'numeric|min:0',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }

    public function exportCsv()
    {
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=products.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $products = Product::all();
        $columns = ['ID', 'Name', 'SKU', 'Description', 'Quantity', 'Price', 'Created At'];

        $callback = function() use($products, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($products as $task) {
                $row['ID']  = $task->id;
                $row['Name']    = $task->name;
                $row['SKU']    = $task->sku;
                $row['Description']  = $task->description;
                $row['Quantity']  = $task->quantity;
                $row['Price']  = $task->price;
                $row['Created At']  = $task->created_at;

                fputcsv($file, array($row['ID'], $row['Name'], $row['SKU'], $row['Description'], $row['Quantity'], $row['Price'], $row['Created At']));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getPathname(), "r");
        
        $header = true;
        while ($csvLine = fgetcsv($handle, 1000, ",")) {
            if ($header) {
                $header = false;
                continue;
            }

            // Expected CSV: ID, Name, SKU, Description, Quantity, Price
            if (count($csvLine) >= 6) {
                Product::updateOrCreate(
                    ['sku' => $csvLine[2]],
                    [
                        'name' => $csvLine[1],
                        'description' => $csvLine[3],
                        'quantity' => (int) $csvLine[4],
                        'price' => (float) $csvLine[5]
                    ]
                );
            }
        }
        fclose($handle);

        return response()->json(['message' => 'Products imported successfully']);
    }
}
