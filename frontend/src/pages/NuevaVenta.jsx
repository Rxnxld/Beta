import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { list as listClientes } from '../services/clienteService'
import { list as listProductos } from '../services/productoService'
import { create } from '../services/ventaService'
import Swal from 'sweetalert2'

const NuevaVenta = () => {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [searchProd, setSearchProd] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [items, setItems] = useState([])
  const [descuento, setDescuento] = useState(0)
  const [tipo, setTipo] = useState('contado')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([listClientes({}), listProductos({})])
        setClientes(cRes.data.results || cRes.data)
        setProductos(pRes.data.results || pRes.data)
      } catch {
        Swal.fire('Error', 'Error al cargar datos', 'error')
      }
    }
    fetchData()
  }, [])

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchProd.toLowerCase()) && p.stock > 0
  )

  const agregarItem = (producto) => {
    const existente = items.find((i) => i.producto_id === producto.id)
    if (existente) {
      setItems(items.map((i) =>
        i.producto_id === producto.id
          ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio_unitario }
          : i
      ))
    } else {
      setItems([...items, {
        producto_id: producto.id,
        nombre: producto.nombre,
        precio_unitario: parseFloat(producto.precio_venta),
        cantidad: 1,
        subtotal: parseFloat(producto.precio_venta)
      }])
    }
  }

  const actualizarCantidad = (productoId, cantidad) => {
    if (cantidad < 1) return
    setItems(items.map((i) =>
      i.producto_id === productoId
        ? { ...i, cantidad, subtotal: cantidad * i.precio_unitario }
        : i
    ))
  }

  const eliminarItem = (productoId) => {
    setItems(items.filter((i) => i.producto_id !== productoId))
  }

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0)
  const descuentoCalc = (subtotal * (parseFloat(descuento) || 0)) / 100
  const total = subtotal - descuentoCalc

  const handleSubmit = async () => {
    if (!clienteId) {
      Swal.fire('Validación', 'Seleccione un cliente', 'warning')
      return
    }
    if (items.length === 0) {
      Swal.fire('Validación', 'Agregue al menos un producto', 'warning')
      return
    }
    if (tipo === 'credito' && !fechaVencimiento) {
      Swal.fire('Validación', 'Seleccione la fecha de vencimiento para venta a crédito', 'warning')
      return
    }
    setSubmitting(true)
    try {
      const data = {
        cliente_id: parseInt(clienteId),
        tipo: tipo,
        productos: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        descuento: parseFloat(descuento) || 0,
        ...(tipo === 'credito' && fechaVencimiento ? { fecha_vencimiento: fechaVencimiento } : {})
      }
      const res = await create(data)
      Swal.fire('Venta Registrada', `Venta #${res.data.id} creada exitosamente`, 'success')
      navigate(`/facturas/${res.data.id}`)
    } catch {
      Swal.fire('Error', 'Error al registrar venta', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>Nueva Venta</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item active">Nueva Venta</li>
          </ol>
        </nav>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-header">Seleccionar Cliente</div>
            <div className="card-body">
              <select className="form-select" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                <option value="">Seleccione un cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.apellido || ''} - {c.telefono || ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Agregar Productos</div>
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar producto..."
                value={searchProd}
                onChange={(e) => setSearchProd(e.target.value)}
              />
              <div className="product-selector" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <div className="list-group">
                  {productosFiltrados.map((p) => (
                    <button
                      key={p.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => agregarItem(p)}
                    >
                      <div>
                        <span className="fw-medium">{p.nombre}</span>
                        <br />
                        <small className="text-muted">Stock: {p.stock}</small>
                      </div>
                      <span className="fw-bold text-primary">$${Number(p.precio_venta).toFixed(2)}</span>
                    </button>
                  ))}
                  {productosFiltrados.length === 0 && (
                    <p className="text-muted text-center py-3 mb-0">No se encontraron productos</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="invoice-wrapper">
            <div className="invoice-header">
              <h4><i className="bi bi-receipt me-2"></i>Factura</h4>
            </div>
            <div className="invoice-body">
              <div className="invoice-items">
                {items.length === 0 ? (
                  <p className="text-muted text-center py-4">Agregue productos a la venta</p>
                ) : (
                  items.map((item) => (
                    <div className="invoice-item" key={item.producto_id}>
                      <div className="flex-grow-1 me-2">
                        <p className="mb-0 fw-medium">{item.nombre}</p>
                        <small className="text-muted">${item.precio_unitario} c/u</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => actualizarCantidad(item.producto_id, item.cantidad - 1)}>-</button>
                        <span className="fw-bold mx-1">{item.cantidad}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => actualizarCantidad(item.producto_id, item.cantidad + 1)}>+</button>
                        <span className="fw-bold text-primary mx-2">${item.subtotal.toFixed(2)}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarItem(item.producto_id)}>
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="invoice-totals">
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label">Descuento (%)</label>
                    <input type="number" className="form-control" value={descuento} onChange={(e) => setDescuento(e.target.value)} min="0" max="100" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Tipo de Pago</label>
                    <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                      <option value="contado">Contado</option>
                      <option value="credito">Crédito</option>
                    </select>
                  </div>
                  {tipo === 'credito' && (
                    <div className="col-6">
                      <label className="form-label">Fecha de Vencimiento</label>
                      <input type="date" className="form-control" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} required />
                    </div>
                  )}
                </div>

                <div className="invoice-total-line">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {descuento > 0 && (
                  <div className="invoice-total-line text-success">
                    <span>Descuento ({descuento}%)</span>
                    <span>-${descuentoCalc.toFixed(2)}</span>
                  </div>
                )}
                <div className="invoice-total-line grand-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 mt-3 btn-lg"
                onClick={handleSubmit}
                disabled={submitting || items.length === 0}
              >
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</>
                ) : (
                  <><i className="bi bi-check-circle me-2"></i>Registrar Venta</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NuevaVenta
