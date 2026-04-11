<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Stock Report</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #1e40af; }
        .header p { margin: 5px 0; color: #64748b; }
        .summary { background: #f8fafc; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
        .summary strong { color: #1e293b; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        th { background-color: #e2e8f0; color: #334155; }
        .low-stock { color: #dc2626; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Stock Inventory Report</h1>
        <p>Generated on: {{ $date }}</p>
    </div>

    <div class="summary">
        <p><strong>Total Unique Products:</strong> {{ $totalProducts }}</p>
        <p><strong>Total Estimated Stock Value:</strong> {{ number_format($totalValue, 2, ',', ' ') }} DH</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Value</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
            <tr>
                <td>{{ $product->sku }}</td>
                <td>{{ $product->name }}</td>
                <td>{{ number_format($product->price, 2, ',', ' ') }} DH</td>
                <td class="{{ $product->quantity < 10 ? 'low-stock' : '' }}">
                    {{ $product->quantity }}
                </td>
                <td>{{ number_format($product->price * $product->quantity, 2, ',', ' ') }} DH</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
