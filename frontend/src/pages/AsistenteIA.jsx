import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { consultar } from '../services/aiService'
import { useAuth } from '../context/AuthContext'

const AsistenteIA = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `¡Hola ${user?.name || 'usuario'}! Soy tu asistente IA. Puedo ayudarte con información sobre ventas, clientes, productos y más. ¿En qué puedo ayudarte?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await consultar(input)
      const assistantMsg = { role: 'assistant', content: res.data.respuesta || res.data.mensaje || 'No entendí tu consulta.' }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, ocurrió un error al procesar tu consulta. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3><i className="bi bi-robot me-2 text-primary"></i>Asistente IA</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item active">Asistente IA</li>
          </ol>
        </nav>
      </div>

      <div className="chat-container">
        <div className="chat-messages" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">
                {msg.role === 'assistant' && (
                  <i className="bi bi-robot me-2 text-primary"></i>
                )}
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message assistant">
              <div className="chat-bubble">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Pensando...
              </div>
            </div>
          )}
        </div>
        <div className="chat-input">
          <form onSubmit={handleSend} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe tu consulta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
              <i className="bi bi-send"></i>
            </button>
          </form>
          <small className="text-muted mt-1 d-block">
            Ej: "¿Cuántas ventas tuvimos este mes?", "¿Qué productos tienen bajo stock?"
          </small>
        </div>
      </div>
    </div>
  )
}

export default AsistenteIA
