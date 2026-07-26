import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { list as listCuentas } from '../services/cuentaService'
import { create } from '../services/pagoService'
import Swal from 'sweetalert2'

const NuevoPago = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const cuentaIdParam = searchParams.get('cuenta_cobrar_id')
  const [cuentas, setCuentas] = useState([])
  const [form, setForm] = useState({
    cuenta_cobrar_id: cuentaIdParam || '',
    monto: '',
    metodo_pago: 'efectivo',
    observacion: '',
    fecha: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const res = await listCuentas({ estado: 'pendiente' })
        const todas = await listCuentas({})
        const pendientes = todas.data.results || todas.data
        setCuentas(pendientes)
      } catch {
        Swal.fire('Error', 'Error al cargar cuentas', 'error')
      }
    }
    fetchCuentas()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const cuentaSel = cuentas.find((c) => c.id === parseInt(form.cuenta_cobrar_id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.cuenta_cobrar_id || !form.monto) {
      Swal.fire('Validación', 'Seleccione una cuenta y monto', 'warning')
      return
    }
    setLoading(true)
    try {
      const payload = {
        cuenta_cobrar_id: parseInt(form.cuenta_cobrar_id),
        monto: parseFloat(form.monto),
        metodo_pago: form.metodo_pago,
        fecha: form.fecha,
        observacion: form.observacion || null
      }
      await create(payload)
      Swal.fire('Registrado', 'Pago registrado correctamente', 'success')
      navigate('/cuentas')
    } catch {
      Swal.fire('Error', 'Error al registrar pago', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>Registrar Pago</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to="/cuentas">Cuentas</Link></li>
            <li className="breadcrumb-item active">Nuevo Pago</li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Cuenta *</label>
                    <select className="form-select" name="cuenta_cobrar_id" value={form.cuenta_cobrar_id} onChange={handleChange}>
                      <option value="">Seleccione una cuenta...</option>
                      {cuentas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cliente_nombre || c.cliente?.nombre || 'N/A'} - ${Number(c.saldo_pendiente).toFixed(2)} (Total: ${Number(c.monto_total).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                  {cuentaSel && (
                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        <strong>Saldo pendiente: </strong>${Number(cuentaSel.saldo_pendiente).toFixed(2)}
                      </div>
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">Monto *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input type="number" step="0.01" className="form-control" name="monto" value={form.monto} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fecha</label>
                    <input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Método de Pago</label>
                    <select className="form-select" name="metodo_pago" value={form.metodo_pago} onChange={handleChange}>
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Observación</label>
                    <input type="text" className="form-control" name="observacion" value={form.observacion} onChange={handleChange} placeholder="Observación" />
                  </div>
                </div>
                <div className="mt-4 d-flex gap-2">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Registrando...</> : <><i className="bi bi-check-circle me-2"></i>Registrar Pago</>}
                  </button>
                  <Link to="/cuentas" className="btn btn-outline-secondary"><i className="bi bi-x-circle me-2"></i>Cancelar</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NuevoPago
