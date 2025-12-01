import React, { useState } from 'react';
import { Zap, Copy, Check } from 'lucide-react';
import { generateQuickCopy } from '../services/geminiService';
import { addToHistory } from '../utils/history';

const QuickCopy: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setCopied(false);
    try {
      const res = await generateQuickCopy(input);
      setOutput(res);
      
      // Save to History
      addToHistory({
        type: 'QUICK_COPY',
        title: 'نسخ إعلاني',
        details: input,
        result: res
      });
    } catch (e) {
      console.error(e);
      setOutput("خطأ في إنشاء النص.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-10">
      <div className="text-center">
         <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-4">
            <Zap className="text-amber-400" size={32} />
         </div>
         <h2 className="text-2xl font-bold text-white">النسخ السريع</h2>
         <p className="text-slate-400 mt-2">نصوص تسويقية بلمح البصر باستخدام Gemini Flash Lite.</p>
      </div>

      <div className="bg-slate-800 p-1 rounded-xl flex shadow-lg">
         <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="اسم المنتج أو الموضوع..."
            className="flex-1 bg-transparent border-none text-white px-4 focus:ring-0 outline-none placeholder-slate-500"
         />
         <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
         >
            {loading ? '...' : 'ابدأ'}
         </button>
      </div>

      {output && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative group">
           <button 
              onClick={copyToClipboard}
              className="absolute top-4 left-4 text-slate-500 hover:text-white transition-colors"
           >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
           </button>
           <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">النتيجة</h3>
           <p className="whitespace-pre-wrap text-lg text-slate-200">{output}</p>
        </div>
      )}
    </div>
  );
};

export default QuickCopy;