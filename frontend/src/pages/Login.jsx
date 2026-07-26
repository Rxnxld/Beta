import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      Swal.fire('Error', 'Complete todos los campos', 'warning')
      return
    }
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch {
      Swal.fire('Error', 'Credenciales inválidas', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="card login-card">
        <div className="card-header">
          <i className="bi bi-shop fs-1 mb-2 d-block"></i>
          <h3>Sistema de Gestión</h3>
          <p className="mb-0 opacity-75">Inicie sesión para continuar</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="admin@admin.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Ingresando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
