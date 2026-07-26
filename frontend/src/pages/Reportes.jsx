import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ventas, productos, clientes, inventario, ganancias, exportar } from '../services/reporteService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { COLORS } from '../utils/constants'
import Swal from 'sweetalert2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title)

const Reportes = () => {
  const [tab, setTab] = useState('ventas')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  const fetchReporte = async (tipo) => {
    setLoading(true)
    try {
      let res
      const params = {}
      if (tipo === 'ventas' || tipo === 'ganancias') {
        if (fechaInicio) params.fecha_inicio = fechaInicio
        if (fechaFin) params.fecha_fin = fechaFin
      }
      switch (tipo) {
        case 'ventas':
          res = await ventas(params)
          break
        case 'productos':
          res = await productos()
          break
        case 'clientes':
          res = await clientes()
          break
        case 'inventario':
          res = await inventario()
          break
        case 'ganancias':
          res = await ganancias(params)
          break
        default:
          res = { data: [] }
      }
      setData(res.data)
    } catch {
      Swal.fire('Error', 'Error al cargar reporte', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (formato) => {
    try {
      const params = {}
      if (fechaInicio) params.fecha_inicio = fechaInicio
      if (fechaFin) params.fecha_fin = fechaFin
      const res = await exportar(tab, formato, params)
      const blob = new Blob([res.data], { type: formato === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte_${tab}.${formato}`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      Swal.fire('Error', 'Error al exportar', 'error')
    }
  }

  const chartVentas = data?.ventas_mensuales ? {
    labels: data.ventas_mensuales.map((v) => v.mes),
    datasets: [{
      label: 'Ventas',
      data: data.ventas_mensuales.map((v) => v.total),
      backgroundColor: COLORS.chart[0],
      borderRadius: 6
    }]
  } : null

  const chartProductos = data?.length ? {
    labels: data.slice(0, 10).map((p) => p.nombre),
    datasets: [{
      label: 'Cantidad',
      data: data.slice(0, 10).map((p) => p.cantidad || p.total),
      backgroundColor: COLORS.chart,
      borderRadius: 6
    }]
  } : null

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3>Reportes</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Reportes</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={() => handleExport('pdf')}>
            <i className="bi bi-file-pdf me-1"></i> PDF
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleExport('excel')}>
            <i className="bi bi-file-earmark-excel me-1"></i> Excel
          </button>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button className={`nav-link ${tab === 'ventas' ? 'active' : ''}`} onClick={() => { setTab('ventas'); fetchReporte('ventas') }}>
                <i className="bi bi-cart me-1"></i> Ventas
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'productos' ? 'active' : ''}`} onClick={() => { setTab('productos'); fetchReporte('productos') }}>
                <i className="bi bi-box me-1"></i> Productos
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'clientes' ? 'active' : ''}`} onClick={() => { setTab('clientes'); fetchReporte('clientes') }}>
                <i className="bi bi-people me-1"></i> Clientes
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'ganancias' ? 'active' : ''}`} onClick={() => { setTab('ganancias'); fetchReporte('ganancias') }}>
                <i className="bi bi-graph-up me-1"></i> Ganancias
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {(tab === 'ventas' || tab === 'ganancias') && (
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="form-label">Fecha Inicio</label>
                <input type="date" className="form-control" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Fecha Fin</label>
                <input type="date" className="form-control" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={() => fetchReporte(tab)}>
                  <i className="bi bi-search me-1"></i> Consultar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
          ) : (
            <>
              {tab === 'ventas' && chartVentas && (
                <div className="chart-container" style={{ height: '350px' }}>
                  <Bar data={chartVentas} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              )}
              {tab === 'productos' && chartProductos && (
                <div className="chart-container" style={{ height: '350px' }}>
                  <Bar data={chartProductos} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} />
                </div>
              )}
              {tab === 'clientes' && data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead><tr><th>Cliente</th><th>Compras</th><th>Total Gastado</th></tr></thead>
                    <tbody>
                      {data.map((c) => (
                        <tr key={c.id}>
                          <td>{c.nombre} {c.apellido || ''}</td>
                          <td>{c.total_compras || 0}</td>
                          <td className="fw-bold">${c.total_gastado || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tab === 'ganancias' && data && (
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="card stat-card border-start-success"><div className="card-body">
                      <p className="stat-label">Ingresos</p>
                      <h3 className="stat-value">${data.ingresos || 0}</h3>
                    </div></div>
                  </div>
                  <div className="col-md-4">
                    <div className="card stat-card border-start-danger"><div className="card-body">
                      <p className="stat-label">Costos</p>
                      <h3 className="stat-value">${data.costos || 0}</h3>
                    </div></div>
                  </div>
                  <div className="col-md-4">
                    <div className="card stat-card border-start-primary"><div className="card-body">
                      <p className="stat-label">Ganancia Neta</p>
                      <h3 className="stat-value">${data.ganancia_neta || 0}</h3>
                    </div></div>
                  </div>
                </div>
              )}
              {!loading && !data && (
                <p className="text-center text-muted py-4">Seleccione un reporte para visualizar</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reportes
