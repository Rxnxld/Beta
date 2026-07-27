import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list } from '../services/productoService'
import { entrada, salida } from '../services/inventarioService'
import Swal from 'sweetalert2'

const InventarioLista = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [tipoMov, setTipoMov] = useState('entrada')
  const [movForm, setMovForm] = useState({ producto_id: '', cantidad: 1, motivo: '' })

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const res = await list({})
      setProductos(res.data.results || res.data)
    } catch {
      Swal.fire('Error', 'Error al cargar inventario', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProductos() }, [])

  const openMovModal = (tipo) => {
    setTipoMov(tipo)
    setMovForm({ producto_id: '', cantidad: 1, motivo: '' })
    setShowModal(true)
  }

  const handleMovChange = (e) => {
    setMovForm({ ...movForm, [e.target.name]: e.target.value })
  }

  const handleMovSubmit = async (e) => {
    e.preventDefault()
    if (!movForm.producto_id || !movForm.cantidad) {
      Swal.fire('Validación', 'Complete todos los campos', 'warning')
      return
    }
    try {
      if (tipoMov === 'entrada') {
        await entrada(movForm)
      } else {
        await salida(movForm)
      }
      Swal.fire('Registrado', 'Movimiento registrado correctamente', 'success')
      setShowModal(false)
      fetchProductos()
    } catch {
      Swal.fire('Error', 'Error al registrar movimiento', 'error')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>Inventario</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Inventario</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={() => openMovModal('entrada')}>
            <i className="bi bi-box-arrow-in-down me-1"></i> Entrada
          </button>
          <button className="btn btn-warning" onClick={() => openMovModal('salida')}>
            <i className="bi bi-box-arrow-up me-1"></i> Salida
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary me-2"></div>Cargando...</td></tr>
                ) : productos.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-muted">Sin productos</td></tr>
                ) : (
                  productos.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-medium">{p.nombre}</td>
                      <td>{p.categoria?.nombre || '-'}</td>
                      <td className="fw-bold">{p.stock}</td>
                      <td>{p.stock_minimo || 5}</td>
                      <td>
                        {p.stock === 0 ? (
                          <span className="badge bg-danger">Sin stock</span>
                        ) : p.stock <= (p.stock_minimo || 5) ? (
                          <span className="badge bg-warning">Stock bajo</span>
                        ) : (
                          <span className="badge bg-success">Normal</span>
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

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {tipoMov === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleMovSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Producto</label>
                    <select className="form-select" name="producto_id" value={movForm.producto_id} onChange={handleMovChange} required>
                      <option value="">Seleccione...</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cantidad</label>
                    <input type="number" className="form-control" name="cantidad" value={movForm.cantidad} onChange={handleMovChange} min="1" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Motivo</label>
                    <input type="text" className="form-control" name="motivo" value={movForm.motivo} onChange={handleMovChange} placeholder="Motivo del movimiento" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Registrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventarioLista
