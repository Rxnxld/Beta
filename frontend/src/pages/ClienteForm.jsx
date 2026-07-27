import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { create, update, getById } from '../services/clienteService'
import Swal from 'sweetalert2'

const ClienteForm = () => {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    direccion: '',
    cedula: ''
  })

  useEffect(() => {
    if (isEditing) {
      const fetchCliente = async () => {
        try {
          const res = await getById(id)
          const c = res.data
          setForm({
            nombre: c.nombre || '',
            apellido: c.apellido || '',
            telefono: c.telefono || '',
            correo: c.correo || '',
            direccion: c.direccion || '',
            cedula: c.cedula || ''
          })
        } catch {
          Swal.fire('Error', 'Error al cargar cliente', 'error')
          navigate('/clientes')
        }
      }
      fetchCliente()
    }
  }, [id, isEditing, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre) {
      Swal.fire('Validación', 'El nombre es obligatorio', 'warning')
      return
    }
    setLoading(true)
    try {
      if (isEditing) {
        await update(id, form)
        Swal.fire('Actualizado', 'Cliente actualizado correctamente', 'success')
      } else {
        await create(form)
        Swal.fire('Creado', 'Cliente creado correctamente', 'success')
      }
      navigate('/clientes')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data?.errors) || 'Error al guardar cliente'
      Swal.fire('Error', msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to="/clientes">Clientes</Link></li>
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
              <div className="col-md-6">
                <label className="form-label">Apellido</label>
                <input type="text" className="form-control" name="apellido" value={form.apellido} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Cédula</label>
                <input type="text" className="form-control" name="cedula" value={form.cedula} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Teléfono</label>
                <input type="text" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Correo</label>
                <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Dirección</label>
                <textarea className="form-control" name="direccion" value={form.direccion} onChange={handleChange} rows="2"></textarea>
              </div>
            </div>
            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : <><i className="bi bi-save me-2"></i>Guardar</>}
              </button>
              <Link to="/clientes" className="btn btn-outline-secondary"><i className="bi bi-x-circle me-2"></i>Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClienteForm
