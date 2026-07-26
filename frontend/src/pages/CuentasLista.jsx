import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list } from '../services/cuentaService'
import Swal from 'sweetalert2'

const CuentasLista = () => {
  const [cuentas, setCuentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchCuentas = async () => {
      setLoading(true)
      try {
        const params = {}
        if (filter) params.estado = filter
        const res = await list(params)
        setCuentas(res.data.results || res.data)
      } catch {
        Swal.fire('Error', 'Error al cargar cuentas', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchCuentas()
  }, [filter])

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>Cuentas por Cobrar</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Cuentas</li>
            </ol>
          </nav>
        </div>
        <Link to="/pagos/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Nuevo Pago
        </Link>
      </div>

      <div className="filters-bar">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Filtrar por estado</label>
            <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">Todas</option>
              <option value="pendiente">Pendiente</option>
              <option value="parcial">Parcial</option>
              <option value="pagada">Pagado</option>
              <option value="vencida">Vencido</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Monto Total</th>
                  <th>Saldo</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary me-2"></div>Cargando...</td></tr>
                ) : cuentas.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">Sin cuentas pendientes</td></tr>
                ) : (
                  cuentas.map((c, idx) => (
                    <tr key={c.id}>
                      <td>{idx + 1}</td>
                      <td className="fw-medium">{c.cliente_nombre || c.cliente?.nombre || 'N/A'}</td>
                      <td className="fw-bold">$${Number(c.monto_total).toFixed(2)}</td>
                      <td className={`fw-bold ${Number(c.saldo_pendiente) > 0 ? 'text-danger' : 'text-success'}`}>$${Number(c.saldo_pendiente).toFixed(2)}</td>
                      <td>{c.fecha_vencimiento || '-'}</td>
                      <td>
                        <span className={`badge ${c.estado === 'pagada' ? 'bg-success' : c.estado === 'vencida' ? 'bg-danger' : c.estado === 'parcial' ? 'bg-warning' : 'bg-secondary'}`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="text-end table-actions">
                        <Link to={`/pagos/nuevo?cuenta_cobrar_id=${c.id}`} className="btn btn-sm btn-success me-1" title="Registrar pago">
                          <i className="bi bi-credit-card"></i>
                        </Link>
                      </td>
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

export default CuentasLista
