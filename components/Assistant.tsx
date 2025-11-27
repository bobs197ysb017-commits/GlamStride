import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Copy, Check } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "مرحباً! أنا مساعد GlamStride. كيف يمكنني مساعدتك في بناء متجرك اليوم؟" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await chatWithAssistant(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، واجهت خطأ." }]);
    } finally {
      setLoading(false);
    }
  };

  // --- Helper: Simple Markdown Formatter ---
  const formatInline = (text: string) => {
    // Split by bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-violet-100 bg-violet-500/20 px-1 rounded">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMessageText = (text: string) => {
    // 1. Split by Code Blocks
    const segments = text.split(/(```[\s\S]*?```)/g);
    
    return segments.map((segment, i) => {
      // Is Code Block?
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const content = segment.slice(3, -3).replace(/^[a-z]+\n/, ''); 
        return (
          <div key={i} className="my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shadow-inner" dir="ltr">
            <div className="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-500 border-b border-slate-700 flex justify-between items-center uppercase tracking-wider font-mono">
              <span>Code Snippet</span>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {content.trim()}
            </pre>
          </div>
        );
      }

      // 2. Process Standard Text Lines
      const lines = segment.split('\n');
      return (
        <div key={i} className="space-y-1">
          {lines.map((line, j) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={j} className="h-2"></div>;

            // Headings
            if (trimmed.startsWith('### ')) {
              return <h3 key={j} className="text-base font-bold text-violet-300 mt-3 mb-1">{formatInline(trimmed.slice(4))}</h3>;
            }
            if (trimmed.startsWith('## ')) {
               return <h2 key={j} className="text-lg font-bold text-violet-200 mt-4 mb-2 pb-1 border-b border-violet-500/30">{formatInline(trimmed.slice(3))}</h2>;
            }

            // Lists
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <div key={j} className="flex gap-2 items-start ms-2 mb-1">
                  <span className="text-violet-500 mt-1.5 text-[10px] flex-shrink-0">•</span>
                  <span className="flex-1 text-slate-200">{formatInline(trimmed.slice(2))}</span>
                </div>
              );
            }
            
            // Numbered Lists
            const numMatch = trimmed.match(/^(\d+)\.\s/);
            if (numMatch) {
               return (
                 <div key={j} className="flex gap-2 items-start ms-2 mb-1">
                   <span className="text-violet-500 font-mono text-xs mt-0.5 font-bold flex-shrink-0">{numMatch[1]}.</span>
                   <span className="flex-1 text-slate-200">{formatInline(trimmed.slice(numMatch[0].length))}</span>
                 </div>
               );
            }

            // Standard Paragraph
            return <p key={j} className="leading-7 text-slate-200">{formatInline(line)}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-900 w-full mx-auto rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center gap-3 shadow-md z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-900/20">
          <Bot size={20} className="text-white" />
        </div>
        <div>
           <h3 className="font-bold text-white text-lg">مساعد GlamStride</h3>
           <p className="text-xs text-slate-400 font-medium">مدعوم بواسطة Gemini 3 Pro</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-950/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-md ${
                m.role === 'user' ? 'bg-slate-700' : 'bg-slate-800 border border-slate-700'
            }`}>
                {m.role === 'user' ? <User size={14} className="text-slate-300" /> : <Bot size={14} className="text-violet-400" />}
            </div>

            {/* Bubble */}
            <div 
              className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm shadow-lg ${
                m.role === 'user' 
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-tl-none' 
                  : 'bg-slate-800/90 backdrop-blur-sm text-slate-200 rounded-tr-none border border-slate-700/50'
              }`}
            >
              {m.role === 'user' ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              ) : (
                  <div className="prose-like">
                    {renderMessageText(m.text)}
                  </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center">
                <Bot size={14} className="text-violet-400" />
             </div>
             <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tr-none border border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل أي شيء، مثلاً: 'اقترح وصفاً لمنتج جديد'..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input}
            className="bg-violet-600 hover:bg-violet-500 text-white px-5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-900/20 active:scale-95 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="rtl:-scale-x-100" />}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 text-center mt-2">
          قد يعرض المساعد معلومات غير دقيقة، يرجى التحقق من المعلومات الهامة.
        </p>
      </div>
    </div>
  );
};

export default Assistant;