import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { isAdmin, isVendedor, isCajero } = useAuth()

  const enlaces = [
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      to: '/',
      roles: ['admin', 'vendedor', 'cajero']
    },
    {
      label: 'Clientes',
      icon: 'bi-people',
      to: '/clientes',
      roles: ['admin', 'vendedor']
    },
    {
      label: 'Productos',
      icon: 'bi-box-seam',
      to: '/productos',
      roles: ['admin', 'vendedor']
    },
    {
      label: 'Nueva Venta',
      icon: 'bi-cart-plus',
      to: '/facturacion/nueva',
      roles: ['admin', 'vendedor']
    },
    {
      label: 'Facturas',
      icon: 'bi-file-text',
      to: '/facturas',
      roles: ['admin', 'vendedor', 'cajero']
    },
    {
      label: 'Cuentas x Cobrar',
      icon: 'bi-credit-card-2-front',
      to: '/cuentas',
      roles: ['admin', 'vendedor']
    },
    {
      label: 'Inventario',
      icon: 'bi-clipboard-data',
      to: '/inventario',
      roles: ['admin']
    },
    {
      label: 'Reportes',
      icon: 'bi-graph-up',
      to: '/reportes',
      roles: ['admin']
    },
    {
      label: 'WhatsApp',
      icon: 'bi-whatsapp',
      to: '/whatsapp',
      roles: ['admin']
    },
    {
      label: 'Configuración',
      icon: 'bi-gear',
      to: '/configuracion',
      roles: ['admin']
    },
    {
      label: 'Asistente IA',
      icon: 'bi-robot',
      to: '/asistente',
      roles: ['admin', 'vendedor']
    }
  ]

  const enlacesFiltrados = enlaces.filter((e) => {
    if (isAdmin) return e.roles.includes('admin')
    if (isVendedor) return e.roles.includes('vendedor')
    if (isCajero) return e.roles.includes('cajero')
    return false
  })

  const sidebarContent = (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className="bi bi-shop fs-3"></i>
        <h5 className="mb-0 ms-2">Sistema Gestión</h5>
      </div>
      <hr className="text-secondary" />
      <ul className="nav flex-column sidebar-nav">
        {enlacesFiltrados.map((enlace) => (
          <li className="nav-item" key={enlace.to}>
            <NavLink
              to={enlace.to}
              end={enlace.to === '/'}
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <i className={`bi ${enlace.icon} me-3`}></i>
              <span>{enlace.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <small className="text-secondary">v1.0.0</small>
      </div>
    </div>
  )

  return (
    <>
      <div className="sidebar-desktop d-none d-lg-block">
        {sidebarContent}
      </div>

      <div
        className="offcanvas offcanvas-start d-lg-none"
        tabIndex="-1"
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
        data-bs-theme="dark"
      >
        <div className="offcanvas-header bg-dark text-white border-bottom">
          <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">
            <i className="bi bi-shop me-2"></i>Sistema Gestión
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-body p-0 bg-dark">
          <ul className="nav flex-column sidebar-nav">
            {enlacesFiltrados.map((enlace) => (
              <li className="nav-item" key={enlace.to}>
                <NavLink
                  to={enlace.to}
                  end={enlace.to === '/'}
                  className={({ isActive }) =>
                    `nav-link sidebar-link ${isActive ? 'active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  <i className={`bi ${enlace.icon} me-3`}></i>
                  <span>{enlace.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar
