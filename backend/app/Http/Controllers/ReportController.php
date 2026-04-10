<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function generateStockReport()
    {
        $products = Product::all();
        $totalProducts = $products->count();
        $totalValue = $products->sum(function($product) {
            return $product->price * $product->quantity;
        });

        $pdf = Pdf::loadView('reports.stock', [
            'products' => $products,
            'totalProducts' => $totalProducts,
            'totalValue' => $totalValue,
            'date' => now()->format('Y-m-d H:i:s')
        ]);

        return $pdf->download('stock_report_' . now()->format('Ymd_His') . '.pdf');
    }
}
