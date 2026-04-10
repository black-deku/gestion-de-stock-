<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\Request;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index()
    {
        // Load relationships and return to frontend
        return response()->json(StockMovement::with(['product', 'user'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:entry,exit',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string'
        ]);
        
        $validated['user_id'] = $request->user()->id;

        DB::transaction(function () use ($validated) {
            StockMovement::create($validated);
            
            $product = Product::findOrFail($validated['product_id']);
            if ($validated['type'] === 'entry') {
                $product->increment('quantity', $validated['quantity']);
            } else {
                $product->decrement('quantity', $validated['quantity']);
            }
        });

        return response()->json(['message' => 'Movement recorded successfully'], 201);
    }
}
