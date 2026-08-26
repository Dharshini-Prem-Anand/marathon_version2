import { MessageSquare, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react'
import { apQuery } from '../data'

export default function ApQueryPanel() {
  return (
    <section className="panel ap-query-panel">
      <h2 className="panel-title ap-query-title">
        <span className="chat-avatar chat-avatar-blue">
          <MessageSquare size={14} />
        </span>
        AP Query
      </h2>

      <div className="chat-bubble chat-bubble-user">{apQuery.question}</div>

      <div className="chat-row">
        <span className="chat-avatar chat-avatar-blue">
          <Sparkles size={14} />
        </span>
        <div className="chat-bubble chat-bubble-ai">{apQuery.answer}</div>
      </div>

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
    </section>
  )
}
