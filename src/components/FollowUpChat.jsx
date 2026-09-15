import React, { useState } from 'react';
import { Send, CornerDownLeft, Sparkles, MessageSquare, Clock } from 'lucide-react';
import axios from 'axios';

export default function FollowUpChat({
  originalQuery,
  followUps = [],
  previousAnswer = '',
  results = [],
  onOpenInTab
}) {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAsk = async (questionText) => {
    const q = (questionText || inputVal).trim();
    if (!q || isSubmitting) return;

    setInputVal('');
    setIsSubmitting(true);

    // Append user question
    const userMsg = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post('/api/followup', {
        originalQuery,
        followUpQuery: q,
        previousAnswer,
        results
      });

      const aiMsg = {
        sender: 'ai',
        text: res.data.answer,
        timestamp: res.data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Could not retrieve follow-up answer: ${err.message}. Please try asking again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="followup-chat-container">
      {/* Messages Thread */}
      {messages.length > 0 && (
        <div className="followup-messages-list">
          {messages.map((msg, i) => (
            <div key={i} className={`followup-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
              <div className="bubble-header">
                <span style={{ fontWeight: 600, color: msg.sender === 'user' ? '#818cf8' : '#38bdf8' }}>
                  {msg.sender === 'user' ? 'You' : 'PRISM AI'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{msg.timestamp}</span>
              </div>
              <div className="bubble-content" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Follow-Up Prompts */}
      {followUps.length > 0 && (
        <div className="followup-prompts-row">
          <div className="followup-prompts-label">
            <Sparkles size={13} color="#06b6d4" />
            <span>Suggested Inquiries:</span>
          </div>
          <div className="followup-chips-wrap">
            {followUps.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="followup-chip"
                onClick={() => handleAsk(prompt)}
                disabled={isSubmitting}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="followup-input-box"
      >
        <MessageSquare size={16} color="#64748b" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Ask a follow-up question about ${originalQuery}...`}
          className="followup-input"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isSubmitting}
          className="btn-followup-submit"
        >
          <span>Ask</span>
          <CornerDownLeft size={13} />
        </button>
      </form>
    </div>
  );
}
