import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Sparkles, ThumbsUp, ThumbsDown, Send } from 'lucide-react'
import { apQuery, apAssistantSampleQuestions } from '../data'
import { sendAssistantChatMessage } from '../api/invoiceAutomation'

function extractReplyText(res) {
  if (typeof res === 'string') return res
  if (res && typeof res === 'object') {
    return res.reply ?? res.message ?? res.response ?? res.answer ?? res.text ?? JSON.stringify(res)
  }
  return String(res)
}

// The assistant replies with lightweight markdown (**bold**, line breaks).
// Render that without pulling in a full markdown library.
function renderFormattedText(text) {
  return text.split('\n').map((line, li) => (
    <div key={li}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
        part.startsWith('**') && part.endsWith('**') ? <strong key={pi}>{part.slice(2, -2)}</strong> : part
      )}
    </div>
  ))
}

export default function ApQueryPanel() {
  const [sessionId] = useState(() => `web-${Math.random().toString(36).slice(2, 10)}`)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const threadRef = useRef(null)

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  function handleSend(text) {
    const question = (text ?? draft).trim()
    if (!question || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setDraft('')
    setLoading(true)

    sendAssistantChatMessage(sessionId, question)
      .then((res) => {
        setMessages((prev) => [...prev, { role: 'ai', text: extractReplyText(res) }])
      })
      .catch((err) => {
        setMessages((prev) => [
          ...prev,
          { role: 'ai', text: `Sorry, I couldn't reach the Intelligent AP Agent service. (${err.message})` },
        ])
      })
      .finally(() => setLoading(false))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="panel ap-query-panel ap-query-panel-full">
      <h2 className="panel-title ap-query-title">
        <span className="chat-avatar chat-avatar-blue">
          <MessageSquare size={14} />
        </span>
        AP Query
      </h2>

      <div className="chat-thread" ref={threadRef}>
        {messages.length === 0 && !loading && (
          <div className="chat-empty-state">
            <p>Ask a question to get started, or try one of these:</p>
            <div className="chat-sample-questions">
              {apAssistantSampleQuestions.map((q) => (
                <button key={q} type="button" className="chat-sample-question" onClick={() => handleSend(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div className="chat-bubble chat-bubble-user" key={i}>
              {m.text}
            </div>
          ) : (
            <div className="chat-row" key={i}>
              <span className="chat-avatar chat-avatar-blue">
                <Sparkles size={14} />
              </span>
              <div className="chat-bubble chat-bubble-ai">{renderFormattedText(m.text)}</div>
            </div>
          )
        )}
        {loading && (
          <div className="chat-row">
            <span className="chat-avatar chat-avatar-blue">
              <Sparkles size={14} />
            </span>
            <div className="chat-bubble chat-bubble-ai chat-bubble-loading">Thinking…</div>
          </div>
        )}
      </div>

      {messages.some((m) => m.role === 'ai') && (
        <div className="chat-footer">
          <span className="chat-disclaimer">{apQuery.disclaimer}</span>
          <span className="chat-feedback">
            <button aria-label="Helpful">
              <ThumbsUp size={14} />
            </button>
            <button aria-label="Not helpful">
              <ThumbsDown size={14} />
            </button>
          </span>
        </div>
      )}

      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Ask the Intelligent AP Agent..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="chat-send-btn" aria-label="Send" onClick={() => handleSend()} disabled={loading}>
          <Send size={15} />
        </button>
      </div>
    </section>
  )
}
