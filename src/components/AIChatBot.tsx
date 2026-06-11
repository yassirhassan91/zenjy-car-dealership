import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, RefreshCw, User } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to Zenjy Motors Dealership. I am your AI Consultant. Ask me about custom APR rates, available hybrid/electric stock, document notarization periods, or vehicle pricing policies!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest response
  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle message send
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages.map(m => ({ role: m.role, content: m.content })),
          message: text
        })
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.reply || "I apologize, our secure pipeline is currently performing routine diagnostic configurations. Please state your query again soon or chat live with our human agents on WhatsApp!",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: "Network diagnostic anomaly detected. Please verify your connection or ping our central sales office via email.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleQuickQuestion = (qn: string) => {
    handleSendMessage(qn);
  };

  return (
    <div id="ai-advisor-integration" className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer border border-blue-500/30"
          title="Open AI Concierge Chat"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Primary chat window */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-3xl col-span-12 w-[340px] md:w-[380px] h-[520px] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-blue-600 border border-blue-500">
                <Bot className="w-5 h-5 text-white" />
              </span>
              <div>
                <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white">ZENJY AI CONSULTANT</h4>
                <p className="text-[9px] text-emerald-400 font-mono tracking-wider">● ONLINE / HIGH STANDARD AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Lists container */}
          <div className="flex-1 overflow-y-auto px-4.5 py-4 flex flex-col gap-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 text-xs items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && (
                  <span className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center p-1 text-blue-600 shrink-0">
                    <Bot className="w-4 h-4" />
                  </span>
                )}
                <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-750 rounded-bl-none shadow-sm'
                }`}>
                  <p>{m.content}</p>
                </div>
              </div>
            ))}
            
            {sending && (
              <div className="flex gap-2 items-center text-xs text-slate-400 ml-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span>Formulating reply...</span>
              </div>
            )}
            <div ref={msgEndRef} />
          </div>

          {/* Quick buttons section */}
          {messages.length < 3 && (
            <div className="p-3 bg-white border-t border-slate-100 flex gap-1.5 flex-wrap">
              {[
                "Tell me about EV options",
                "What forms of payment?",
                "Do you customize vintage SUVs?",
                "Zero APR deals?"
              ].map((qn, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(qn)}
                  className="px-2 py-1 text-[10px] rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-505 font-medium cursor-pointer"
                >
                  {qn}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-white border-t border-slate-105 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query vehicle terms, finance formulas..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:bg-slate-200 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
