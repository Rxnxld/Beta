import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getById, historialCompras, historialPagos, historialDeudas } from '../services/clienteService'
import Swal from 'sweetalert2'

const ClienteHistorial = () => {
  const { id } = useParams()
  const [cliente, setCliente] = useState(null)
  const [compras, setCompras] = useState([])
  const [pagos, setPagos] = useState([])
  const [deudas, setDeudas] = useState([])
  const [tab, setTab] = useState('compras')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, compRes, pagRes, deuRes] = await Promise.all([
          getById(id),
          historialCompras(id),
          historialPagos(id),
          historialDeudas(id)
        ])
        setCliente(cRes.data)
        setCompras(compRes.data.results || compRes.data)
        setPagos(pagRes.data.results || pagRes.data)
        setDeudas(deuRes.data.results || deuRes.data)
      } catch {
        Swal.fire('Error', 'Error al cargar historial', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
  }

  if (!cliente) {
    return <div className="text-center py-5 text-muted">Cliente no encontrado</div>
  }

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>{cliente.nombre} {cliente.apellido || ''}</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/clientes">Clientes</Link></li>
              <li className="breadcrumb-item active">Historial</li>
            </ol>
          </nav>
        </div>
        <Link to={`/clientes/${id}/editar`} className="btn btn-primary">
          <i className="bi bi-pencil me-2"></i>Editar
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start-primary h-100">
            <div className="card-body">
              <p className="stat-label">Teléfono</p>
              <p className="fw-bold mb-0">{cliente.telefono || '-'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start-success h-100">
            <div className="card-body">
              <p className="stat-label">Email</p>
              <p className="fw-bold mb-0">{cliente.correo || '-'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start-warning h-100">
            <div className="card-body">
              <p className="stat-label">Compras</p>
              <p className="fw-bold mb-0">{compras.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start-danger h-100">
            <div className="card-body">
              <p className="stat-label">Deuda Total</p>
              <p className="fw-bold mb-0 text-danger">${cliente.deuda || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button className={`nav-link ${tab === 'compras' ? 'active' : ''}`} onClick={() => setTab('compras')}>
                <i className="bi bi-cart me-1"></i> Compras
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'pagos' ? 'active' : ''}`} onClick={() => setTab('pagos')}>
                <i className="bi bi-credit-card me-1"></i> Pagos
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'deudas' ? 'active' : ''}`} onClick={() => setTab('deudas')}>
                <i className="bi bi-exclamation-triangle me-1"></i> Deudas
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  {tab === 'compras' && <><th># Factura</th><th>Fecha</th><th>Total</th><th>Estado</th></>}
                  {tab === 'pagos' && <><th>#</th><th>Fecha</th><th>Monto</th><th>Método</th></>}
                  {tab === 'deudas' && <><th># Cuenta</th><th>Monto Total</th><th>Saldo</th><th>Estado</th></>}
                </tr>
              </thead>
              <tbody>
                {(tab === 'compras' ? compras : tab === 'pagos' ? pagos : deudas).length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-muted">Sin registros</td></tr>
                ) : (
                  (tab === 'compras' ? compras : tab === 'pagos' ? pagos : deudas).map((item) => (
                    <tr key={item.id}>
                      {tab === 'compras' && (
                        <>
                          <td><Link to={`/facturas/${item.id}`}>{item.numero_factura || item.id}</Link></td>
                          <td>{item.fecha_creacion || item.fecha}</td>
                          <td>${item.total}</td>
                          <td><span className={`status-${item.estado}`}>{item.estado}</span></td>
                        </>
                      )}
                      {tab === 'pagos' && (
                        <>
                          <td>{item.id}</td>
                          <td>{item.fecha}</td>
                          <td>${item.monto}</td>
                          <td>{item.metodo_pago}</td>
                        </>
                      )}
                      {tab === 'deudas' && (
                        <>
                          <td>{item.id}</td>
                          <td>${item.monto_total}</td>
                          <td className="text-danger fw-bold">${item.saldo}</td>
                          <td><span className={`status-${item.estado}`}>{item.estado}</span></td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClienteHistorial
