import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list, remove } from '../services/clienteService'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'

const ClientesLista = () => {
  const { isAdmin } = useAuth()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchClientes = async () => {
    setLoading(true)
    try {
      const res = await list({ search, page })
      setClientes(res.data.results || res.data)
      setTotalPages(Math.ceil((res.data.count || res.data.length) / 20) || 1)
    } catch {
      Swal.fire('Error', 'Error al cargar clientes', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchClientes()
  }

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: `Se eliminará a ${nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (result.isConfirmed) {
      try {
        await remove(id)
        Swal.fire('Eliminado', 'Cliente eliminado correctamente', 'success')
        fetchClientes()
      } catch {
        Swal.fire('Error', 'No se pudo eliminar el cliente', 'error')
      }
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>Clientes</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Clientes</li>
            </ol>
          </nav>
        </div>
        <Link to="/clientes/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Nuevo Cliente
        </Link>
      </div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="row g-2 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Buscar</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre, teléfono o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-search"></i> Buscar
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Deuda</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                      Cargando...
                    </td>
                  </tr>
                ) : clientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">No hay clientes registrados</td>
                  </tr>
                ) : (
                  clientes.map((c, idx) => (
                    <tr key={c.id}>
                      <td>{(page - 1) * 20 + idx + 1}</td>
                      <td>
                        <Link to={`/clientes/${c.id}/historial`} className="fw-medium">
                          {c.nombre} {c.apellido || ''}
                        </Link>
                      </td>
                      <td>{c.telefono || '-'}</td>
                      <td>{c.correo || '-'}</td>
                      <td>
                        <span className={Number(c.deuda_total) > 0 ? 'text-danger fw-bold' : 'text-success'}>
                          ${Number(c.deuda_total || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-end table-actions">
                        <Link to={`/clientes/${c.id}/historial`} className="btn btn-sm btn-info me-1" title="Historial">
                          <i className="bi bi-clock-history"></i>
                        </Link>
                        <Link to={`/clientes/${c.id}/editar`} className="btn btn-sm btn-primary me-1" title="Editar">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        {isAdmin && (
                          <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => handleDelete(c.id, c.nombre)}>
                            <i className="bi bi-trash"></i>
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
        {totalPages > 1 && (
          <div className="card-footer d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}><i className="bi bi-chevron-left"></i></button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}><i className="bi bi-chevron-right"></i></button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientesLista
