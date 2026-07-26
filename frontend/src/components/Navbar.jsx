import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { list as listNotis, marcarLeido } from '../services/notificacionService'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [notificaciones, setNotificaciones] = useState([])
  const [showNotis, setShowNotis] = useState(false)

  const cargarNotificaciones = useCallback(async () => {
    try {
      const res = await listNotis()
      setNotificaciones(res.data)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (user) {
      cargarNotificaciones()
      const interval = setInterval(cargarNotificaciones, 30000)
      return () => clearInterval(interval)
    }
  }, [user, cargarNotificaciones])

  const noLeidas = notificaciones.filter((n) => !n.leida).length

  const handleMarcarLeida = async (id) => {
    try {
      await marcarLeido(id)
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      )
    } catch {
      // ignore
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top px-3">
      <div className="container-fluid">
        <button
          className="btn btn-dark d-lg-none me-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
        >
          <i className="bi bi-list"></i>
        </button>

        <span className="navbar-brand d-flex align-items-center">
          <i className="bi bi-shop me-2"></i>
          <span className="d-none d-sm-inline">Sistema de Gestión</span>
        </span>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          >
            <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'}`}></i>
          </button>

          <div className="dropdown">
            <button
              className="btn btn-dark position-relative"
              onClick={() => setShowNotis(!showNotis)}
              data-bs-toggle="dropdown"
              aria-expanded={showNotis}
            >
              <i className="bi bi-bell"></i>
              {noLeidas > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {noLeidas > 9 ? '9+' : noLeidas}
                </span>
              )}
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${showNotis ? 'show' : ''}`} style={{ width: '350px' }}>
              <li>
                <h6 className="dropdown-header d-flex justify-content-between align-items-center">
                  Notificaciones
                  {noLeidas > 0 && (
                    <span className="badge bg-primary rounded-pill">{noLeidas} nuevas</span>
                  )}
                </h6>
              </li>
              <li><hr className="dropdown-divider" /></li>
              {notificaciones.length === 0 ? (
                <li><span className="dropdown-item text-muted">Sin notificaciones</span></li>
              ) : (
                notificaciones.slice(0, 10).map((noti) => (
                  <li key={noti.id}>
                    <button
                      className={`dropdown-item ${!noti.leida ? 'fw-bold bg-light' : ''}`}
                      onClick={() => handleMarcarLeida(noti.id)}
                    >
                      <div className="d-flex align-items-start gap-2">
                        <i className={`bi bi-circle-fill mt-1 ${noti.leida ? 'text-secondary' : 'text-primary'}`} style={{ fontSize: '0.5rem' }}></i>
                        <div>
                          <small className={noti.leida ? '' : 'fw-bold'}>{noti.mensaje}</small>
                          <br />
                          <small className="text-muted">{noti.fecha}</small>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-dark dropdown-toggle d-flex align-items-center gap-1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle"></i>
              <span className="d-none d-md-inline">{user?.nombre || user?.username}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <span className="dropdown-item-text">
                  <small className="text-muted">
                    {user?.email}
                    <br />
                    <span className="badge bg-info mt-1">{user?.rol}</span>
                  </small>
                </span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
