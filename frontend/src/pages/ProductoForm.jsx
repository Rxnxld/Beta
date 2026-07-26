import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { create, update, getById } from '../services/productoService'
import { list as listCategorias } from '../services/categoriaService'
import Swal from 'sweetalert2'

const ProductoForm = () => {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio_venta: '',
    precio_compra: '',
    codigo: '',
    stock: 0,
    stock_minimo: 5,
    categoria_id: '',
    estado: true
  })

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await listCategorias()
        setCategorias(res.data.results || res.data || [])
      } catch { /* ignore */ }
    }
    fetchCategorias()

    if (isEditing) {
      const fetchProducto = async () => {
        try {
          const res = await getById(id)
          const p = res.data
          setForm({
            nombre: p.nombre || '',
            descripcion: p.descripcion || '',
            precio_venta: p.precio_venta || '',
            precio_compra: p.precio_compra || '',
            codigo: p.codigo || '',
            stock: p.stock || 0,
            stock_minimo: p.stock_minimo || 5,
            categoria_id: p.categoria_id || (p.categoria?.id || ''),
            estado: p.estado !== undefined ? p.estado : true
          })
        } catch {
          Swal.fire('Error', 'Error al cargar producto', 'error')
          navigate('/productos')
        }
      }
      fetchProducto()
    }
  }, [id, isEditing, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.precio_venta) {
      Swal.fire('Validación', 'Nombre y precio son obligatorios', 'warning')
      return
    }
    setLoading(true)
    try {
      if (isEditing) {
        await update(id, form)
        Swal.fire('Actualizado', 'Producto actualizado', 'success')
      } else {
        await create(form)
        Swal.fire('Creado', 'Producto creado', 'success')
      }
      navigate('/productos')
    } catch {
      Swal.fire('Error', 'Error al guardar producto', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
            <li className="breadcrumb-item active">{isEditing ? 'Editar' : 'Nuevo'}</li>
          </ol>
        </nav>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre *</label>
                <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Código</label>
                <input type="text" className="form-control" name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código único" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Categoría</label>
                <select className="form-select" name="categoria_id" value={form.categoria_id} onChange={handleChange}>
                  <option value="">Seleccione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Precio Venta *</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="number" step="0.01" className="form-control" name="precio_venta" value={form.precio_venta} onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label">Precio Compra</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="number" step="0.01" className="form-control" name="precio_compra" value={form.precio_compra} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-2">
                <label className="form-label">Stock</label>
                <input type="number" className="form-control" name="stock" value={form.stock} onChange={handleChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Stock Mínimo</label>
                <input type="number" className="form-control" name="stock_minimo" value={form.stock_minimo} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} rows="3"></textarea>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" name="estado" checked={form.estado} onChange={handleChange} id="estado" />
                  <label className="form-check-label" htmlFor="estado">Producto activo</label>
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : <><i className="bi bi-save me-2"></i>Guardar</>}
              </button>
              <Link to="/productos" className="btn btn-outline-secondary"><i className="bi bi-x-circle me-2"></i>Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductoForm
