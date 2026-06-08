<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\StockMovement;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalProducts = Product::count();
        $totalStockValue = Product::selectRaw('SUM(price * quantity) as total')->value('total') ?? 0;
        
        $lowStockProducts = Product::where('quantity', '<', 10)->get();
        
        $latestMovements = StockMovement::with(['product', 'user'])
            ->latest()
            ->take(5)
            ->get();
            
        // For chart: aggregate entries/exits over last 7 days
        // simplified version:
        $chartData = [
            ['name' => 'Mon', 'Entries' => 4, 'Exits' => 2],
            ['name' => 'Tue', 'Entries' => 3, 'Exits' => 1],
            ['name' => 'Wed', 'Entries' => 2, 'Exits' => 5],
            ['name' => 'Thu', 'Entries' => 6, 'Exits' => 2],
            ['name' => 'Fri', 'Entries' => 1, 'Exits' => 4],
        ];

        return response()->json([
            'total_products' => $totalProducts,
            'total_value' => $totalStockValue,
            'low_stock' => $lowStockProducts,
            'latest_movements' => $latestMovements,
            'chart_data' => $chartData
        ]);
    }
}
