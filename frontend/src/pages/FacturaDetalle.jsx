import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getById, generarPdf, anular } from '../services/ventaService'
import Swal from 'sweetalert2'

const FacturaDetalle = () => {
  const { id } = useParams()
  const [factura, setFactura] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const res = await getById(id)
        setFactura(res.data)
      } catch {
        Swal.fire('Error', 'Error al cargar factura', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchFactura()
  }, [id])

  const handlePdf = async () => {
    try {
      const res = await generarPdf(id)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      window.open(url)
    } catch {
      Swal.fire('Error', 'Error al generar PDF', 'error')
    }
  }

  const handleAnular = async () => {
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
        Swal.fire('Anulada', 'Factura anulada', 'success')
        const res = await getById(id)
        setFactura(res.data)
      } catch {
        Swal.fire('Error', 'No se pudo anular', 'error')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
  }

  if (!factura) {
    return <div className="text-center py-5 text-muted">Factura no encontrada</div>
  }

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>Factura #{factura.factura?.numero_factura || factura.id}</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/facturas">Facturas</Link></li>
              <li className="breadcrumb-item active">#{factura.factura?.numero_factura || factura.id}</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handlePdf}>
            <i className="bi bi-file-pdf me-1"></i> PDF
          </button>
          {factura.estado !== 'anulada' && (
            <button className="btn btn-danger" onClick={handleAnular}>
              <i className="bi bi-x-circle me-1"></i> Anular
            </button>
          )}
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between">
          <span>Información de Factura</span>
          <span className={`badge ${factura.estado === 'completada' ? 'bg-success' : 'bg-danger'}`}>{factura.estado}</span>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <p className="mb-1 text-muted">Cliente</p>
              <p className="fw-bold">{factura.cliente_nombre || factura.cliente?.nombre || 'N/A'}</p>
            </div>
            <div className="col-md-3">
              <p className="mb-1 text-muted">Fecha</p>
              <p className="fw-bold">{factura.created_at ? new Date(factura.created_at).toLocaleDateString() : '-'}</p>
            </div>
            <div className="col-md-3">
              <p className="mb-1 text-muted">Tipo de Pago</p>
              <p className="fw-bold">{factura.tipo || 'contado'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">Productos</div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Precio Unit.</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(factura.productos || []).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.producto?.nombre || item.nombre || `Producto #${item.producto_id}`}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">${Number(item.precio_unitario).toFixed(2)}</td>
                    <td className="text-end fw-bold">${Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="d-flex justify-content-between mb-1">
                <span>Subtotal</span>
                <span>${Number(factura.subtotal || 0).toFixed(2)}</span>
              </div>
              {Number(factura.iva) > 0 && (
                <div className="d-flex justify-content-between mb-1">
                  <span>IVA</span>
                  <span>${Number(factura.iva).toFixed(2)}</span>
                </div>
              )}
              {Number(factura.descuento) > 0 && (
                <div className="d-flex justify-content-between mb-1 text-success">
                  <span>Descuento</span>
                  <span>-${Number(factura.descuento).toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">${Number(factura.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacturaDetalle
