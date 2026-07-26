import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list, anular } from '../services/ventaService'
import Swal from 'sweetalert2'

const FacturasLista = () => {
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const fetchFacturas = async () => {
    setLoading(true)
    try {
      const res = await list({ search, page })
      setFacturas(res.data.results || res.data)
    } catch {
      Swal.fire('Error', 'Error al cargar facturas', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFacturas() }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchFacturas()
  }

  const handleAnular = async (id) => {
    const result = await Swal.fire({
      title: '¿Anular factura?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    })
    if (result.isConfirmed) {
      try {
        await anular(id)
        Swal.fire('Anulada', 'Factura anulada correctamente', 'success')
        fetchFacturas()
      } catch {
        Swal.fire('Error', 'No se pudo anular la factura', 'error')
      }
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>Facturas</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Facturas</li>
            </ol>
          </nav>
        </div>
        <Link to="/facturacion/nueva" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Nueva Venta
        </Link>
      </div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="row g-2">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Buscar por # factura o cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100"><i className="bi bi-search me-1"></i>Buscar</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead>
                <tr>
                  <th># Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary me-2"></div>Cargando...</td></tr>
                ) : facturas.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-muted">Sin facturas</td></tr>
                ) : (
                  facturas.map((f) => (
                    <tr key={f.id}>
                      <td className="fw-bold">#{f.factura?.numero_factura || f.id}</td>
                      <td>{f.cliente_nombre || f.cliente?.nombre || 'N/A'}</td>
                      <td>{f.created_at ? new Date(f.created_at).toLocaleDateString() : '-'}</td>
                      <td className="fw-bold">$${Number(f.total).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${f.estado === 'completada' ? 'bg-success' : f.estado === 'anulada' ? 'bg-danger' : 'bg-secondary'}`}>
                          {f.estado}
                        </span>
                      </td>
                      <td className="text-end table-actions">
                        <Link to={`/facturas/${f.id}`} className="btn btn-sm btn-info me-1" title="Ver detalle">
                          <i className="bi bi-eye"></i>
                        </Link>
                        {f.estado !== 'anulada' && (
                          <button className="btn btn-sm btn-danger" title="Anular" onClick={() => handleAnular(f.id)}>
                            <i className="bi bi-x-circle"></i>
                          </button>
                        )}
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

export default FacturasLista
