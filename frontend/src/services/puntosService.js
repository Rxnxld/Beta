import api from './api'

export const list = () => api.get('/puntos/')

export const canjear = (data) => api.post('/puntos/canjear/', data)
