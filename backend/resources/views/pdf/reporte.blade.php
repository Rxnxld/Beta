<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $titulo }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #2563eb;
            font-size: 20px;
            margin: 5px 0;
        }
        .header p {
            margin: 2px 0;
            color: #666;
            font-size: 10px;
        }
        .header .logo {
            max-height: 60px;
            margin-bottom: 8px;
        }
        .fecha-reporte {
            text-align: right;
            font-size: 10px;
            color: #94a3b8;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table thead th {
            background: #2563eb;
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        table tbody td {
            padding: 6px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 10px;
        }
        table tbody tr:nth-child(even) {
            background: #f8fafc;
        }
        table tbody tr:last-child td {
            border-bottom: 2px solid #2563eb;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
        .footer .page-number:before {
            content: "Página " counter(page);
        }
        .summary {
            margin-top: 20px;
            padding: 12px;
            background: #f0f4ff;
            border-radius: 5px;
            border-left: 4px solid #2563eb;
        }
        .summary h3 {
            margin: 0 0 8px;
            color: #2563eb;
            font-size: 13px;
        }
        .summary p {
            margin: 3px 0;
            font-size: 11px;
        }
        .bajo-stock {
            color: #dc2626;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        @if (!empty($config['logo']))
            <img src="{{ public_path('storage/' . $config['logo']) }}" alt="Logo" class="logo">
        @endif
        <h1>{{ $config['nombre_empresa'] ?? 'Sistema de Gestión' }}</h1>
        <p>{{ $config['direccion'] ?? '' }} | Tel: {{ $config['telefono'] ?? '' }} | Email: {{ $config['email'] ?? '' }}</p>
    </div>

    <h2 style="color: #2563eb; font-size: 16px; margin: 10px 0;">{{ $titulo }}</h2>

    <div class="fecha-reporte">
        Generado el: {{ now()->format('d/m/Y H:i') }}
    </div>

    @if (count($datos) > 0)
        <table>
            <thead>
                <tr>
                    @foreach (array_keys((array)$datos->first()) as $columna)
                        <th>{{ ucwords(str_replace('_', ' ', $columna)) }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach ($datos as $fila)
                    <tr>
                        @foreach ((array)$fila as $valor)
                            <td>{{ is_numeric($valor) && !is_int($valor) ? '$' . number_format((float)$valor, 2) : $valor }}</td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p style="text-align: center; color: #94a3b8; padding: 30px;">No hay datos disponibles para este reporte.</p>
    @endif

    <div class="summary">
        <h3>Resumen</h3>
        <p><strong>Total de registros:</strong> {{ count($datos) }}</p>
    </div>

    <div class="footer">
        <p>{{ $config['nombre_empresa'] ?? 'Sistema de Gestión' }} - {{ $config['direccion'] ?? '' }}</p>
        <p>Tel: {{ $config['telefono'] ?? '' }} | Email: {{ $config['email'] ?? '' }}</p>
        <span class="page-number"></span>
    </div>
</body>
</html>
