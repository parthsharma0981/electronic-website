import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, ShoppingBag, HelpCircle, Package, ChevronRight } from 'lucide-react';
import api from '../services/api.js';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: 'Browse Products', icon: <ShoppingBag size={13} />, query: 'show me products' },
  { label: 'Track Order', icon: <Package size={13} />, query: 'how do I track my order' },
  { label: 'FAQ', icon: <HelpCircle size={13} />, query: 'frequently asked questions' },
  { label: 'Contact Support', icon: <MessageCircle size={13} />, query: 'contact support' },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'bot', text: "Hi! 👋 I'm **E-Core Assistant**. I can help you find products, track orders, answer questions, and more!\n\nWhat can I help you with today?", timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg: Message = { id: generateId(), role: 'user', text: msg, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/chat', {
        messages: updatedMessages.map(m => ({ role: m.role, text: m.text }))
      });
      const botMsg: Message = { id: generateId(), role: 'bot', text: res.data.response, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const botMsg: Message = { id: generateId(), role: 'bot', text: "I'm having trouble connecting to my AI brain right now. Try again later!", timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages]);

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="chatbot-bubble"
            aria-label="Open AI Assistant"
          >
            <MessageCircle size={24} />
            <span className="chatbot-bubble-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="chatbot-window"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="chatbot-avatar">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>E-Core Assistant</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} />
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Online • Powered by AI</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="chatbot-close">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chatbot-msg ${msg.role}`}
                >
                  {msg.role === 'bot' && (
                    <div className="chatbot-msg-avatar">
                      <Sparkles size={12} />
                    </div>
                  )}
                  <div
                    className={`chatbot-msg-bubble ${msg.role}`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                  />
                  {msg.role === 'user' && (
                    <div className="chatbot-msg-avatar user">
                      <User size={12} />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chatbot-msg bot">
                  <div className="chatbot-msg-avatar"><Sparkles size={12} /></div>
                  <div className="chatbot-msg-bubble bot chatbot-typing">
                    <span /><span /><span />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="chatbot-quick-actions">
                {QUICK_ACTIONS.map(a => (
                  <button key={a.label} onClick={() => handleSend(a.query)} className="chatbot-chip">
                    {a.icon} {a.label} <ChevronRight size={11} />
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chatbot-input-bar">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="chatbot-input"
              />
              <button onClick={() => handleSend()} className="chatbot-send" disabled={!input.trim()}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
