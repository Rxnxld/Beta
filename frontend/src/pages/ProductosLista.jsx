import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list, remove } from '../services/productoService'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'

const ProductosLista = () => {
  const { isAdmin } = useAuth()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('table')

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const res = await list({ search })
      setProductos(res.data.results || res.data)
    } catch {
      Swal.fire('Error', 'Error al cargar productos', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProductos() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProductos()
  }

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `Se eliminará ${nombre}`,
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
        Swal.fire('Eliminado', 'Producto eliminado', 'success')
        fetchProductos()
      } catch {
        Swal.fire('Error', 'No se pudo eliminar', 'error')
      }
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>Productos</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Productos</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <div className="btn-group" role="group">
            <button className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('table')}>
              <i className="bi bi-list"></i>
            </button>
            <button className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('grid')}>
              <i className="bi bi-grid"></i>
            </button>
          </div>
          <Link to="/productos/nuevo" className="btn btn-primary">
            <i className="bi bi-plus-lg"></i> Nuevo Producto
          </Link>
        </div>
      </div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="row g-2">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100"><i className="bi bi-search me-1"></i>Buscar</button>
          </div>
        </form>
      </div>

      {view === 'table' ? (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead>
                  <tr><th>#</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th className="text-end">Acciones</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary me-2"></div>Cargando...</td></tr>
                  ) : productos.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-4 text-muted">Sin productos</td></tr>
                  ) : (
                    productos.map((p, idx) => (
                      <tr key={p.id}>
                        <td>{idx + 1}</td>
                        <td className="fw-medium">{p.nombre}</td>
                        <td>{p.categoria?.nombre || '-'}</td>
                        <td className="fw-bold">${Number(p.precio_venta).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${p.stock <= (p.stock_minimo || 5) ? 'bg-danger' : p.stock <= (p.stock_minimo || 5) * 2 ? 'bg-warning' : 'bg-success'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="text-end table-actions">
                          <Link to={`/productos/${p.id}/editar`} className="btn btn-sm btn-primary me-1" title="Editar">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          {isAdmin && (
                            <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => handleDelete(p.id, p.nombre)}>
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
        </div>
      ) : (
        <div className="row g-3">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
          ) : productos.length === 0 ? (
            <div className="text-center py-5 text-muted">Sin productos</div>
          ) : (
            productos.map((p) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={p.id}>
                <div className="card product-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-secondary">{p.categoria?.nombre || 'General'}</span>
                      <span className={`badge ${p.stock <= (p.stock_minimo || 5) ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock} uds
                      </span>
                    </div>
                    <h6 className="card-title mb-1">{p.nombre}</h6>
                    <p className="product-price mb-2">${Number(p.precio_venta).toFixed(2)}</p>
                    <div className="d-flex gap-1">
                      <Link to={`/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary flex-grow-1">
                        <i className="bi bi-pencil me-1"></i>Editar
                      </Link>
                      {isAdmin && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id, p.nombre)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ProductosLista
