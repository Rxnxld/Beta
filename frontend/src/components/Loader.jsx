const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando...</p>
      </div>
    </div>
  )
}

export default Loader
