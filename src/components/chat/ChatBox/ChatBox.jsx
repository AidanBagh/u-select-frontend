import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, CircleStop, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../../../services/api';
import './ChatBox.css';

const WORD_INTERVAL = 60; // ms per word
const MAX_DURATION = 3000; // max ms for any reply

const INITIAL_MESSAGE = {
  role: 'ai',
  text: "Hi! I'm Umurava AI, your recruiter assistant. How can I help you today? You can ask me anything or attach a CV to extract candidate details.",
};

function ChatBox({ isOpen, onClose }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Word-by-word typewriter with adaptive speed
  useEffect(() => {
    const idx = messages.findIndex((m) => m.isStreaming);
    if (idx === -1) return;

    const msg = messages[idx];
    const words = msg.fullText.split(' ');
    const currentWords = msg.text === '' ? 0 : msg.text.split(' ').length;

    if (currentWords >= words.length) {
      setMessages((prev) =>
        prev.map((m, i) => (i === idx ? { role: 'ai', text: m.fullText } : m))
      );
      return;
    }

    const delay = Math.min(WORD_INTERVAL, MAX_DURATION / words.length);

    const timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === idx
            ? { ...m, text: words.slice(0, currentWords + 1).join(' ') }
            : m
        )
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleStop = () => {
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { role: 'ai', text: m.text } : m))
    );
  };

  const send = async () => {
    const text = input.trim();
    if (!text && !file) return;
    if (loading) return;

    const historySnapshot = messages; // snapshot before state update — excludes the new message

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: text || '', fileName: file ? file.name : null },
    ]);
    setInput('');
    const attachedFile = file;
    setFile(null);
    setLoading(true);

    try {
      const { reply } = await sendChatMessage(text, attachedFile, historySnapshot);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '', fullText: reply, isStreaming: true },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    if (picked) setFile(picked);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="chat-box-container">
      <div className="chat-box-header">
        <div className="chat-box-header-title">
          <Sparkles size={16} className="chat-box-header-icon" />
          <span className="chat-box-title-text">Umurava AI</span>
        </div>
        <button className="chat-box-close-btn" onClick={onClose} aria-label="Close Chat">
          <X size={20} />
        </button>
      </div>

      <div className="chat-box-messages" ref={messagesRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-box-message chat-box-message--${msg.role}`}
          >
            {msg.role === 'ai' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              <>
                {msg.fileName && (
                  <span className="chat-box-file-badge">
                    <Paperclip size={13} />
                    {msg.fileName}
                  </span>
                )}
                {msg.text && <span>{msg.text}</span>}
              </>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-box-message chat-box-message--ai chat-box-message--loading">
            <span className="chat-box-typing-dots">
              <span /><span /><span />
            </span>
          </div>
        )}

      </div>

      {file && (
        <div className="chat-box-file-chip">
          <span className="chat-box-file-chip-name"><Paperclip size={13} /> {file.name}</span>
          <button className="chat-box-file-chip-remove" onClick={() => setFile(null)} aria-label="Remove file">×</button>
        </div>
      )}

      <div className="chat-box-input-area">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.csv,.xlsx,.xls"
          className="chat-box-file-input"
          onChange={handleFileChange}
        />
        <button
          className="chat-box-attach-btn"
          aria-label="Attach CV"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          className="chat-box-input"
          placeholder={file ? 'Add a message (optional)…' : 'Ask me anything...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        {(loading || messages.some((m) => m.isStreaming)) ? (
          <button
            className="chat-box-stop-btn"
            aria-label="Stop"
            onClick={handleStop}
          >
            <CircleStop size={18} />
          </button>
        ) : (
          <button
            className="chat-box-send-btn"
            aria-label="Send Message"
            onClick={send}
            disabled={loading}
          >
            <Send size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatBox;