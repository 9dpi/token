'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getUserBalance, calculateQConsumption } from '@/lib/q-core';

export default function MobileApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Login Demo
  const handleLogin = async () => {
    setIsLoggedIn(true);
    // Giả lập lấy balance từ GAS mà bạn đã cung cấp
    setBalance(100.00); // Demo balance
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Logic xử lý AI & Khấu trừ Q (Giả lập)
    setTimeout(() => {
      const aiResponse = "Chào bạn! Đây là phản hồi từ AI Core của Unit Q. Yêu cầu của bạn đang được xử lý...";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Tính toán trừ Q (Giả lập GPT-4o input/output tokens)
      const consumedQ = calculateQConsumption('gpt-4o', 500, 1000);
      setBalance(prev => (prev !== null ? prev - consumedQ : null));
      setLoading(false);
    }, 1000);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black p-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center text-black font-extrabold text-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-8">
          Q
        </div>
        <h1 className="text-3xl font-bold text-gold mb-2 text-center uppercase tracking-widest">AI TOKEN INDEX</h1>
        <p className="text-text-sub text-center mb-10 text-sm">Premium AI Gateway — Powered by Q Token</p>

        <button
          onClick={handleLogin}
          className="w-full max-w-xs bg-white text-black font-bold py-4 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>
        <p className="mt-8 text-xs text-text-sub opacity-50">QR Code Link: Scanned from Dashboard</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505]">
      {/* Top Header & Marquee */}
      <header className="glass-effect sticky top-0 z-20 px-4 py-3 border-b border-[#222]">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded shadow-[0_0_10px_rgba(212,175,55,0.5)] flex items-center justify-center text-black font-bold text-xs">Q</div>
            <span className="font-bold text-gold tracking-tighter">AI INDEX - MOBILE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-[10px] text-text-sub uppercase font-bold">Encrypted</span>
          </div>
        </div>

        {/* Balance Marquee */}
        <div className="overflow-hidden bg-[#111] rounded py-1 px-2 border border-[#222]">
          <div className="whitespace-nowrap animate-marquee flex gap-8">
            <span className="text-[11px] text-primary">● HIỆN CÓ: <strong className="font-mono">{balance?.toFixed(6)} Q</strong></span>
            <span className="text-[11px] text-text-sub">● TỶ GIÁ GPT-4o: 50Q / 1M Input Tokens</span>
            <span className="text-[11px] text-text-sub">● THIẾT BỊ ĐÃ KẾT NỐI: MOBILE-IPHONE-09</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-6">
            <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center mb-4">
              🤖
            </div>
            <p className="text-sm">Start chatting with AI Token Index.<br />Your balance will be updated in real-time.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
              ? 'bg-primary text-black font-medium rounded-tr-none'
              : 'bg-[#1a1a1a] border border-[#222] text-white rounded-tl-none shadow-lg'
              }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-[#222] rounded-2xl px-4 py-2 flex gap-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </main>

      {/* Bottom Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 glass-effect">
        <div className="flex gap-2 max-w-xl mx-auto items-center bg-[#1a1a1a] rounded-full p-1 pl-4 border border-[#333]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your AI request..."
            className="flex-1 bg-transparent text-sm outline-none border-none py-2"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
