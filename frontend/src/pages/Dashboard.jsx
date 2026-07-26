import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getCharts } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { COLORS } from '../utils/constants'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title)

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [charts, setCharts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([getStats(), getCharts()])
        setStats(statsRes.data)
        setCharts(chartsRes.data)
      } catch {
        // error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Ventas Hoy', value: stats?.ventas_dia?.count || 0, icon: 'bi-cart-check', color: 'primary', change: '' },
    { label: 'Ingresos Hoy', value: `$${Number(stats?.ventas_dia?.total || 0).toFixed(2)}`, icon: 'bi-currency-dollar', color: 'success', change: '' },
    { label: 'Clientes', value: stats?.clientes_count || 0, icon: 'bi-people', color: 'info', change: '' },
    { label: 'Productos Bajos', value: stats?.productos_bajo_stock?.length || 0, icon: 'bi-exclamation-triangle', color: 'danger', change: '' },
    { label: 'Ventas Mes', value: stats?.ventas_mes?.count || 0, icon: 'bi-graph-up', color: 'warning', change: '' },
    { label: 'Cuentas Pendientes', value: stats?.clientes_deudas?.count || 0, icon: 'bi-credit-card', color: 'secondary', change: '' }
  ]

  const ventasChartData = charts?.ventas_por_mes ? {
    labels: charts.ventas_por_mes.map((v) => {
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
      return months[v.mes - 1]
    }),
    datasets: [{
      label: 'Ventas',
      data: charts.ventas_por_mes.map((v) => Number(v.total)),
      backgroundColor: COLORS.chart?.length ? COLORS.chart[0] : '#2563eb',
      borderRadius: 6
    }]
  } : null

  const productosChartData = charts?.productos_mas_vendidos ? {
    labels: charts.productos_mas_vendidos.map((p) => p.producto?.nombre || 'Producto'),
    datasets: [{
      data: charts.productos_mas_vendidos.map((p) => Number(p.total_cantidad)),
      backgroundColor: COLORS.chart || ['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#84cc16'],
      borderWidth: 0
    }]
  } : null

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>Dashboard</h3>
        <p className="text-muted mb-0">Bienvenido, {user?.name || 'usuario'}</p>
      </div>

      <div className="row g-3 mb-4">
        {statCards.map((card, idx) => (
          <div className="col-xl-4 col-md-6" key={idx}>
            <div className={`card stat-card border-start-${card.color} h-100`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="stat-label mb-1">{card.label}</p>
                    <h3 className="stat-value mb-0">{card.value}</h3>
                    {card.change && <small className="stat-change text-success">{card.change}</small>}
                  </div>
                  <div className={`stat-icon bg-${card.color}-light bg-opacity-10 text-${card.color}`}>
                    <i className={`bi ${card.icon}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Ventas Mensuales</span>
              <Link to="/reportes" className="btn btn-sm btn-outline-primary">Ver Reportes</Link>
            </div>
            <div className="card-body">
              {ventasChartData ? (
                <div className="chart-container">
                  <Bar
                    data={ventasChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { grid: { display: false } }
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted text-center my-4">Sin datos disponibles</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header">Productos Más Vendidos</div>
            <div className="card-body d-flex align-items-center justify-content-center">
              {productosChartData ? (
                <div style={{ maxHeight: '280px', maxWidth: '280px' }}>
                  <Doughnut
                    data={productosChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { padding: 12, boxWidth: 12, font: { size: 11 } }
                        }
                      },
                      cutout: '65%'
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted text-center my-4">Sin datos disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
