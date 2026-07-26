<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Factura {{ $venta->factura->numero_factura }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #2563eb;
            font-size: 24px;
            margin: 10px 0 5px;
        }
        .header p {
            margin: 2px 0;
            color: #666;
            font-size: 11px;
        }
        .logo {
            max-height: 80px;
            margin-bottom: 10px;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 5px;
        }
        .info-box {
            width: 48%;
        }
        .info-box h3 {
            color: #2563eb;
            font-size: 13px;
            margin: 0 0 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }
        .info-box p {
            margin: 3px 0;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table thead th {
            background: #2563eb;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
        }
        table tbody td {
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
        }
        table tbody tr:nth-child(even) {
            background: #f8fafc;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .totals {
            width: 320px;
            margin-left: auto;
            margin-top: 10px;
        }
        .totals table {
            margin: 0;
        }
        .totals td {
            padding: 6px 10px;
            border: none;
        }
        .totals .total-row td {
            font-weight: bold;
            font-size: 14px;
            color: #2563eb;
            border-top: 2px solid #2563eb;
            padding-top: 8px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
        }
        .terms {
            margin-top: 30px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 5px;
            font-size: 10px;
            color: #666;
        }
        .terms h4 {
            margin: 0 0 8px;
            color: #333;
        }
        .estado-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .estado-completada {
            background: #dcfce7;
            color: #166534;
        }
        .estado-anulada {
            background: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="header">
        @if (!empty($config['logo']))
            <img src="{{ public_path('storage/' . $config['logo']) }}" alt="Logo" class="logo">
        @endif
        <h1>{{ $config['nombre_empresa'] ?? 'Sistema de Gestión' }}</h1>
        <p>{{ $config['direccion'] ?? '' }}</p>
        <p>Tel: {{ $config['telefono'] ?? '' }} | Email: {{ $config['email'] ?? '' }}</p>
    </div>

    <div class="info-section">
        <div class="info-box">
            <h3>Facturar a</h3>
            <p><strong>Nombre:</strong> {{ $venta->cliente->nombreCompleto ?? 'Cliente ocasional' }}</p>
            <p><strong>Cédula:</strong> {{ $venta->cliente->cedula ?? 'N/A' }}</p>
            <p><strong>Dirección:</strong> {{ $venta->cliente->direccion ?? 'N/A' }}</p>
            <p><strong>Teléfono:</strong> {{ $venta->cliente->telefono ?? 'N/A' }}</p>
        </div>
        <div class="info-box">
            <h3>Factura</h3>
            <p><strong>Número:</strong> {{ $venta->factura->numero_factura }}</p>
            <p><strong>Fecha:</strong> {{ $venta->factura->fecha->format('d/m/Y') }}</p>
            <p><strong>Tipo:</strong> {{ ucfirst($venta->tipo) }}</p>
            <p>
                <strong>Estado:</strong>
                <span class="estado-badge estado-{{ $venta->estado }}">{{ ucfirst($venta->estado) }}</span>
            </p>
            <p><strong>Vendedor:</strong> {{ $venta->user->name ?? 'N/A' }}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>Producto</th>
                <th class="text-center">Cantidad</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($venta->productos as $item)
            <tr>
                <td>{{ $item->producto->codigo ?? 'N/A' }}</td>
                <td>{{ $item->producto->nombre ?? 'N/A' }}</td>
                <td class="text-center">{{ $item->cantidad }}</td>
                <td class="text-right">${{ number_format($item->precio_unitario, 2) }}</td>
                <td class="text-right">${{ number_format($item->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td><strong>Subtotal:</strong></td>
                <td class="text-right">${{ number_format($venta->subtotal, 2) }}</td>
            </tr>
            <tr>
                <td><strong>IVA:</strong></td>
                <td class="text-right">${{ number_format($venta->iva, 2) }}</td>
            </tr>
            @if ($venta->descuento > 0)
            <tr>
                <td><strong>Descuento:</strong></td>
                <td class="text-right">-${{ number_format($venta->descuento, 2) }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td><strong>Total:</strong></td>
                <td class="text-right">${{ number_format($venta->total, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="terms">
        <h4>Términos y Condiciones</h4>
        <p>{{ $config['terminos_condiciones'] ?? 'Los productos adquiridos no tienen cambio después de 3 días de realizada la compra. El precio incluye IVA.' }}</p>
        @if (!empty($config['mensaje_factura']))
            <p>{{ $config['mensaje_factura'] }}</p>
        @endif
    </div>

    <div class="footer">
        <p>{{ $config['nombre_empresa'] ?? 'Sistema de Gestión' }} - {{ $config['direccion'] ?? '' }}</p>
        <p>Tel: {{ $config['telefono'] ?? '' }} | Email: {{ $config['email'] ?? '' }}</p>
        <p>Esta factura es un documento válido. Gracias por su compra.</p>
    </div>
</body>
</html>
