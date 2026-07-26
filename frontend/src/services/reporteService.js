import api from './api'

export const ventas = (params) => api.get('/reportes/ventas/', { params })

export const productos = () => api.get('/reportes/productos/')

export const clientes = () => api.get('/reportes/clientes/')

export const inventario = () => api.get('/reportes/inventario/')

export const ganancias = (params) => api.get('/reportes/ganancias/', { params })

export const exportar = (tipo, formato, params) =>
  api.get(`/reportes/exportar/${tipo}/${formato}/`, {
    params,
    responseType: 'blob'
  })
