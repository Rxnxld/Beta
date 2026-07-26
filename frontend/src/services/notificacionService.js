import api from './api'

export const list = () => api.get('/api/notificaciones')

export const marcarLeido = (id) => api.put(`/api/notificaciones/${id}/leer`)

export const marcarTodasLeidas = () => api.put('/api/notificaciones/leer-todas')
