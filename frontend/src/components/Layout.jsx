import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Loader from './Loader'

const Layout = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return null
  }

  return (
    <div className="layout-wrapper">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <main className="main-content flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
