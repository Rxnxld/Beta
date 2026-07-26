import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientesLista from './pages/ClientesLista'
import ClienteForm from './pages/ClienteForm'
import ClienteHistorial from './pages/ClienteHistorial'
import ProductosLista from './pages/ProductosLista'
import ProductoForm from './pages/ProductoForm'
import NuevaVenta from './pages/NuevaVenta'
import FacturasLista from './pages/FacturasLista'
import FacturaDetalle from './pages/FacturaDetalle'
import CuentasLista from './pages/CuentasLista'
import NuevoPago from './pages/NuevoPago'
import InventarioLista from './pages/InventarioLista'
import Reportes from './pages/Reportes'
import WhatsAppPage from './pages/WhatsAppPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import AsistenteIA from './pages/AsistenteIA'

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="clientes" element={<ClientesLista />} />
              <Route path="clientes/nuevo" element={<ClienteForm />} />
              <Route path="clientes/:id/editar" element={<ClienteForm />} />
              <Route path="clientes/:id/historial" element={<ClienteHistorial />} />
              <Route path="productos" element={<ProductosLista />} />
              <Route path="productos/nuevo" element={<ProductoForm />} />
              <Route path="productos/:id/editar" element={<ProductoForm />} />
              <Route path="facturacion/nueva" element={<NuevaVenta />} />
              <Route path="facturas" element={<FacturasLista />} />
              <Route path="facturas/:id" element={<FacturaDetalle />} />
              <Route path="cuentas" element={<CuentasLista />} />
              <Route path="pagos/nuevo" element={<NuevoPago />} />
              <Route path="inventario" element={<InventarioLista />} />
              <Route path="reportes" element={<Reportes />} />
              <Route path="whatsapp" element={<WhatsAppPage />} />
              <Route path="configuracion" element={<ConfiguracionPage />} />
              <Route path="asistente" element={<AsistenteIA />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
