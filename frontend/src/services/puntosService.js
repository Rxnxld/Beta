import api from './api'

export const list = () => api.get('/api/puntos/clientes')

export const canjear = (data) => api.post('/api/puntos/canjear', data)
