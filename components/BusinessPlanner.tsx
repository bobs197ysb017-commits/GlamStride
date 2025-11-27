import React, { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { generateBusinessPlan } from '../services/geminiService';

const BusinessPlanner: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleThink = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setPlan('');
    try {
      const result = await generateBusinessPlan(topic);
      setPlan(result);
    } catch (err) {
      console.error(err);
      setPlan("فشل في إنشاء الاستراتيجية. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-violet-500" /> 
            استراتيجيات الذكاء
          </h2>
          <p className="text-slate-400 mt-1">محرك تفكير عميق لخطط العمل المعقدة (Gemini 3 Pro + Thinking Mode).</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex gap-2">
           <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثلاً: 'تطوير استراتيجية إطلاق لمدة 3 أشهر لعلامة تجارية فاخرة للحقائب تستهدف الجيل Z'"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500"
           />
           <button
              onClick={handleThink}
              disabled={loading || !topic}
              className="bg-gradient-to-l from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-violet-900/20 disabled:opacity-50 flex items-center gap-2"
           >
             {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
             <span>تخطيط</span>
           </button>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto relative custom-scrollbar">
           {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                   <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                   <Loader2 size={48} className="text-violet-400 animate-spin relative z-10" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-violet-300 font-medium animate-pulse">يفكر بعمق...</p>
                  <p className="text-xs text-slate-500">تخصيص ميزانية 32k رمز (token) للاستنتاج</p>
                </div>
             </div>
           ) : plan ? (
             <div className="prose prose-invert max-w-none prose-headings:text-violet-300 prose-a:text-pink-400">
               <div className="whitespace-pre-wrap">{plan}</div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600">
               <BrainCircuit size={64} className="opacity-10 mb-4" />
               <p>أدخل استعلام أعمال معقد لبدء عملية التفكير العميق.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanner;