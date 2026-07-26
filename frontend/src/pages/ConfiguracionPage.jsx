import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getConfig, updateConfig, subirLogo } from '../services/configService'
import Swal from 'sweetalert2'

const ConfiguracionPage = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    empresa_nombre: '',
    empresa_direccion: '',
    empresa_telefono: '',
    empresa_email: '',
    website: '',
    moneda: 'USD',
    iva_porcentaje: 0,
    whatsapp_numero: ''
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getConfig()
        const c = res.data
        setConfig(c)
        setForm({
          empresa_nombre: c.empresa_nombre || '',
          empresa_direccion: c.empresa_direccion || '',
          empresa_telefono: c.empresa_telefono || '',
          empresa_email: c.empresa_email || '',
          website: c.website || '',
          moneda: c.moneda || 'USD',
          iva_porcentaje: c.iva_porcentaje || 0,
          whatsapp_numero: c.whatsapp_numero || ''
        })
      } catch {
        Swal.fire('Error', 'Error al cargar configuración', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateConfig(form)
      Swal.fire('Guardado', 'Configuración actualizada', 'success')
    } catch {
      Swal.fire('Error', 'Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogo = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('logo', file)
    try {
      await subirLogo(formData)
      Swal.fire('Subido', 'Logo actualizado correctamente', 'success')
    } catch {
      Swal.fire('Error', 'Error al subir logo', 'error')
    }
  }

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3><i className="bi bi-gear me-2"></i>Configuración</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item active">Configuración</li>
          </ol>
        </nav>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">Información de la Empresa</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre de la Empresa</label>
                    <input type="text" className="form-control" name="empresa_nombre" value={form.empresa_nombre} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="empresa_telefono" value={form.empresa_telefono} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="empresa_email" value={form.empresa_email} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Website</label>
                    <input type="text" className="form-control" name="website" value={form.website} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="empresa_direccion" value={form.empresa_direccion} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Moneda</label>
                    <select className="form-select" name="moneda" value={form.moneda} onChange={handleChange}>
                      <option value="USD">USD</option>
                      <option value="PYG">PYG</option>
                      <option value="EUR">EUR</option>
                      <option value="BRL">BRL</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">IVA (%)</label>
                    <input type="number" className="form-control" name="iva_porcentaje" value={form.iva_porcentaje} onChange={handleChange} step="0.01" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">WhatsApp Número</label>
                    <input type="text" className="form-control" name="whatsapp_numero" value={form.whatsapp_numero} onChange={handleChange} placeholder="+595..." />
                  </div>
                </div>
                <div className="mt-4">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : <><i className="bi bi-save me-2"></i>Guardar Configuración</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">Logo</div>
            <div className="card-body text-center">
              {config?.logo ? (
                <img src={config.logo} alt="Logo" className="img-fluid mb-3" style={{ maxHeight: '150px' }} />
              ) : (
                <div className="mb-3 p-4 bg-light rounded">
                  <i className="bi bi-image fs-1 text-muted"></i>
                  <p className="text-muted mt-2">Sin logo</p>
                </div>
              )}
              <input type="file" className="form-control" accept="image/*" onChange={handleLogo} />
              <small className="text-muted">Formatos: PNG, JPG. Max 2MB</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracionPage
