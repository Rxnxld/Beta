import api from './api'

export const getConfig = () => api.get('/api/configuraciones')

export const updateConfig = (data) => api.put('/api/configuraciones', { configuraciones: data })

export const subirLogo = (formData) =>
  api.post('/api/configuraciones/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
