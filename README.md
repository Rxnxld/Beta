# Sistema Inteligente de Gestión de Ventas, Facturación y Cobros

Sistema web profesional para pequeños y medianos negocios que permite administrar clientes, productos, ventas, facturas, inventario y cuentas por cobrar, con integración a WhatsApp Business y asistente con IA.

## 🚀 Tecnologías

### Frontend
- React 19
- Vite 6
- Bootstrap 5.3
- React Router 7
- Axios
- Chart.js + react-chartjs-2
- SweetAlert2
- Bootstrap Icons

### Backend
- Laravel 12
- API RESTful
- Laravel Sanctum (JWT)
- Eloquent ORM
- Dompdf (PDF)
- Maatwebsite/Laravel-Excel

### Base de Datos
- MySQL 8+

### Servicios
- WhatsApp Business API
- Asistente con IA integrada (consultas a base de datos)

## 📋 Requisitos

- PHP 8.2+
- Composer 2
- Node.js 18+
- NPM 9+
- MySQL 8+
- Extensiones PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, GD

## 🛠 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sistema-gestion
```

### 2. Configurar Backend (Laravel)

```bash
cd backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones y seeders
php artisan migrate --seed

# Crear enlace de almacenamiento
php artisan storage:link

# Iniciar servidor
php artisan serve
```

### 3. Configurar Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Acceder al sistema

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

### 5. Credenciales por defecto

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@admin.com | password |
| Vendedor | vendedor@vendedor.com | password |
| Cajero | cajero@cajero.com | password |

## 🏗 Estructura del Proyecto

```
sistema-gestion/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Exports/           # Exportaciones Excel
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # Controladores API
│   │   │   ├── Middleware/        # Middleware por roles
│   │   │   └── Requests/         # Validaciones
│   │   ├── Models/            # Modelos Eloquent
│   │   └── Services/          # WhatsApp, IA
│   ├── config/                # Configuraciones
│   ├── database/
│   │   ├── factories/         # Factories
│   │   ├── migrations/        # Migraciones (12 tablas)
│   │   └── seeders/           # Seeders
│   ├── resources/views/pdf/   # Plantillas PDF
│   └── routes/api.php         # Rutas API
├── frontend/                   # App React
│   ├── src/
│   │   ├── assets/css/        # Estilos
│   │   ├── components/        # Componentes (Layout, Sidebar, etc.)
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── pages/             # Páginas (Dashboard, Clientes, etc.)
│   │   ├── services/          # Servicios API
│   │   └── utils/             # Constantes
│   └── vite.config.js
└── README.md
```

## 📦 Módulos del Sistema

### 1. Dashboard
- Estadísticas en tiempo real (ventas hoy/mes, clientes, productos bajos)
- Gráficos interactivos (ventas mensuales, productos más vendidos)
- Tarjetas con indicadores clave

### 2. Gestión de Clientes
- CRUD completo con búsqueda instantánea
- Historial de compras, pagos y deudas
- Sistema de puntos para clientes frecuentes
- Envío de WhatsApp directo

### 3. Gestión de Productos
- CRUD completo con control de inventario
- Categorización de productos
- Alerta de stock mínimo
- Vista en tabla o cuadrícula

### 4. Facturación
- Interfaz tipo POS con carrito de compras
- Cálculo automático de subtotal, IVA, descuento y total
- Generación de PDF
- Envío de factura por WhatsApp
- Ventas al contado y crédito

### 5. Cuentas por Cobrar
- Control de ventas a crédito
- Registro de pagos parciales y totales
- Cálculo automático de saldo pendiente
- Alertas de vencimiento

### 6. Inventario
- Control de entradas y salidas
- Historial completo de movimientos
- Validación de stock disponible

### 7. Reportes
- Reportes de ventas, productos, clientes
- Ganancias mensuales
- Exportación a PDF y Excel
- Filtros por rango de fechas

### 8. WhatsApp Business
- Envío de facturas en PDF
- Recordatorios de pago
- Confirmaciones de pago
- Promociones a clientes
- Mensajes personalizados

### 9. Asistente IA
- Responder preguntas en lenguaje natural:
  - "¿Cuánto vendí hoy?"
  - "¿Qué cliente debe más dinero?"
  - "¿Qué productos debo comprar nuevamente?"
  - "¿Cuáles fueron los productos más vendidos?"

### 10. Configuración
- Datos de la empresa
- Logo personalizado
- Porcentaje de IVA
- Configuración de WhatsApp
- Modo oscuro/claro

## 🔐 Roles y Permisos

| Módulo | Admin | Vendedor | Cajero |
|--------|-------|----------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| Clientes | ✅ | ✅ | ❌ |
| Productos | ✅ | ✅ | ❌ |
| Facturación | ✅ | ✅ | ❌ |
| Facturas | ✅ | ✅ | ✅ |
| Cuentas Cobrar | ✅ | ✅ | ❌ |
| Inventario | ✅ | ❌ | ❌ |
| Reportes | ✅ | ❌ | ❌ |
| WhatsApp | ✅ | ❌ | ❌ |
| Configuración | ✅ | ❌ | ❌ |
| Asistente IA | ✅ | ✅ | ❌ |

## 🔌 API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión
- `GET /api/user` - Obtener usuario autenticado

### Dashboard
- `GET /api/dashboard` - Estadísticas
- `GET /api/dashboard/charts` - Datos para gráficos

### Clientes
- `GET /api/clientes` - Listar (paginado, búsqueda)
- `POST /api/clientes` - Crear
- `GET /api/clientes/{id}` - Ver
- `PUT /api/clientes/{id}` - Actualizar
- `DELETE /api/clientes/{id}` - Eliminar
- `GET /api/clientes/{id}/historial-compras` - Historial de compras
- `GET /api/clientes/{id}/historial-pagos` - Historial de pagos
- `GET /api/clientes/{id}/historial-deudas` - Historial de deudas

### Productos
- `GET /api/productos` - Listar (paginado, búsqueda, filtro)
- `POST /api/productos` - Crear
- `GET /api/productos/{id}` - Ver
- `PUT /api/productos/{id}` - Actualizar
- `DELETE /api/productos/{id}` - Eliminar
- `GET /api/productos/bajo-stock` - Productos con bajo stock
- `GET /api/productos/{id}/movimientos` - Movimientos de inventario

### Ventas y Facturación
- `POST /api/ventas` - Crear venta
- `GET /api/ventas` - Listar ventas
- `GET /api/ventas/{id}` - Ver venta
- `PUT /api/ventas/{id}/anular` - Anular venta
- `GET /api/ventas/{id}/pdf` - Descargar PDF de venta

### Cuentas por Cobrar y Pagos
- `GET /api/cuentas-cobrar` - Listar
- `POST /api/cuentas-cobrar` - Crear
- `POST /api/pagos` - Registrar pago
- `GET /api/pagos` - Listar pagos

### Reportes
- `GET /api/reportes/ventas` - Reporte de ventas
- `GET /api/reportes/productos` - Reporte de productos
- `GET /api/reportes/ganancias` - Reporte de ganancias
- `GET /api/reportes/exportar/{tipo}/{formato}` - Exportar reporte

### WhatsApp
- `POST /api/whatsapp/enviar` - Enviar mensaje
- `POST /api/whatsapp/enviar-factura` - Enviar factura PDF

### IA
- `POST /api/ai/consultar` - Consultar asistente IA

### Configuración
- `GET /api/configuraciones` - Obtener configuraciones
- `PUT /api/configuraciones` - Actualizar configuraciones

## 🗄 Base de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `clientes` - Clientes
- `categorias` - Categorías de productos
- `productos` - Productos
- `ventas` - Ventas realizadas
- `venta_productos` - Detalle de productos por venta
- `facturas` - Facturas generadas
- `cuentas_cobrar` - Cuentas por cobrar
- `pagos` - Pagos registrados
- `movimientos_inventario` - Movimientos de inventario
- `configuraciones` - Configuraciones del sistema
- `puntos_clientes` - Puntos de clientes frecuentes
- `notificaciones` - Notificaciones del sistema

## 🎨 Personalización

### Modo Oscuro
El sistema incluye modo oscuro/claro. Puede cambiarse desde el botón en la barra superior.

### Configuración de Empresa
Desde el módulo de Configuración puedes personalizar:
- Nombre de la empresa
- Dirección
- Teléfono
- Email
- Logo
- Porcentaje de IVA
- Moneda

## 📱 WhatsApp Business API

Para configurar WhatsApp Business:

1. Crear una cuenta en [Meta for Developers](https://developers.facebook.com/)
2. Configurar una aplicación de WhatsApp Business
3. Obtener el `Phone Number ID` y `Access Token`
4. Configurar en `.env`:
   ```
   WHATSAPP_API_URL=https://graph.facebook.com/v17.0
   WHATSAPP_PHONE_NUMBER_ID=tu_id
   WHATSAPP_ACCESS_TOKEN=tu_token
   ```

## 🤖 Asistente IA

El asistente IA funciona consultando directamente la base de datos. Las preguntas disponibles son:

- "¿Cuánto vendí hoy?" - Muestra el total de ventas del día
- "¿Qué cliente debe más dinero?" - Cliente con mayor deuda pendiente
- "¿Qué productos debo comprar nuevamente?" - Productos con stock bajo o agotado
- "¿Cuáles fueron los productos más vendidos?" - Top 10 productos más vendidos

## 📄 Licencia

Este proyecto es de código abierto. Puedes usarlo, modificarlo y distribuirlo libremente.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abrir Pull Request
