import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { enviar, enviarFactura, enviarRecordatorio, enviarPromocion } from '../services/whatsappService'
import { list as listClientes } from '../services/clienteService'
import Swal from 'sweetalert2'

const WhatsAppPage = () => {
  const [tab, setTab] = useState('mensaje')
  const [clientes, setClientes] = useState([])
  const [form, setForm] = useState({
    destinatario: '',
    mensaje: '',
    cliente_id: '',
    factura_id: '',
    monto: '',
    fecha_vencimiento: '',
    promocion: ''
  })
  const [loading, setLoading] = useState(false)

  const loadClientes = async () => {
    try {
      const res = await listClientes({})
      setClientes(res.data.results || res.data)
    } catch {
      // ignore
    }
  }

  useEffect(() => { loadClientes() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let res
      switch (tab) {
        case 'mensaje':
          res = await enviar({ destinatario: form.destinatario, mensaje: form.mensaje })
          break
        case 'factura':
          res = await enviarFactura({ cliente_id: form.cliente_id, factura_id: form.factura_id })
          break
        case 'recordatorio':
          res = await enviarRecordatorio({ cliente_id: form.cliente_id, monto: form.monto, fecha_vencimiento: form.fecha_vencimiento })
          break
        case 'promocion':
          res = await enviarPromocion({ cliente_id: form.cliente_id, promocion: form.promocion })
          break
      }
      Swal.fire('Enviado', 'Mensaje enviado correctamente', 'success')
    } catch {
      Swal.fire('Error', 'Error al enviar mensaje', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3><i className="bi bi-whatsapp me-2 text-success"></i>WhatsApp</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item active">WhatsApp</li>
          </ol>
        </nav>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button className={`nav-link ${tab === 'mensaje' ? 'active' : ''}`} onClick={() => setTab('mensaje')}>
                <i className="bi bi-chat-dots me-1"></i> Mensaje
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'factura' ? 'active' : ''}`} onClick={() => setTab('factura')}>
                <i className="bi bi-file-text me-1"></i> Factura
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'recordatorio' ? 'active' : ''}`} onClick={() => setTab('recordatorio')}>
                <i className="bi bi-bell me-1"></i> Recordatorio
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'promocion' ? 'active' : ''}`} onClick={() => setTab('promocion')}>
                <i className="bi bi-megaphone me-1"></i> Promoción
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {tab === 'mensaje' && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Número de Teléfono</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-whatsapp"></i></span>
                      <input type="text" className="form-control" name="destinatario" value={form.destinatario} onChange={handleChange} placeholder="+595 XXX XXX XXX" required />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Mensaje</label>
                    <textarea className="form-control" name="mensaje" value={form.mensaje} onChange={handleChange} rows="4" required></textarea>
                  </div>
                </>
              )}
              {(tab === 'factura' || tab === 'recordatorio' || tab === 'promocion') && (
                <div className="col-md-6">
                  <label className="form-label">Cliente</label>
                  <select className="form-select" name="cliente_id" value={form.cliente_id} onChange={handleChange} required>
                    <option value="">Seleccione...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre} {c.apellido || ''} - {c.telefono}</option>
                    ))}
                  </select>
                </div>
              )}
              {tab === 'factura' && (
                <div className="col-md-6">
                  <label className="form-label">Nº Factura</label>
                  <input type="text" className="form-control" name="factura_id" value={form.factura_id} onChange={handleChange} placeholder="ID de factura" required />
                </div>
              )}
              {tab === 'recordatorio' && (
                <>
                  <div className="col-md-3">
                    <label className="form-label">Monto</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input type="number" className="form-control" name="monto" value={form.monto} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Vencimiento</label>
                    <input type="date" className="form-control" name="fecha_vencimiento" value={form.fecha_vencimiento} onChange={handleChange} required />
                  </div>
                </>
              )}
              {tab === 'promocion' && (
                <div className="col-12">
                  <label className="form-label">Mensaje Promocional</label>
                  <textarea className="form-control" name="promocion" value={form.promocion} onChange={handleChange} rows="4" placeholder="Describa la promoción..." required></textarea>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Enviando...</> : <><i className="bi bi-send me-2"></i>Enviar por WhatsApp</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppPage
