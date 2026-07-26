import api from './api'

export const ventas = (params) => api.get('/api/reportes/ventas', { params })

export const productos = () => api.get('/api/reportes/productos')

export const clientes = () => api.get('/api/reportes/clientes')

export const inventario = () => api.get('/api/reportes/inventario')

export const ganancias = (params) => api.get('/api/reportes/ganancias', { params })

export const exportar = (tipo, formato, params) =>
  api.get(`/api/reportes/exportar/${tipo}/${formato}`, {
    params,
    responseType: 'blob'
  })
