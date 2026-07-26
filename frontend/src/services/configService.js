import api from './api'

export const getConfig = () => api.get('/configuraciones')

export const updateConfig = (data) => api.put('/configuraciones', { configuraciones: data })

export const subirLogo = (formData) =>
  api.post('/configuraciones/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
