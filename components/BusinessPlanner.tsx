import React, { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { generateBusinessPlan } from '../services/geminiService';
import { addToHistory } from '../utils/history';
import MarkdownRenderer from './MarkdownRenderer';

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
      
      // Save to History
      addToHistory({
        type: 'STRATEGY',
        title: 'استراتيجية أعمال',
        details: topic,
        result: result.substring(0, 300) + (result.length > 300 ? '...' : '')
      });
    } catch (err) {
      console.error(err);
      setPlan("فشل في إنشاء الاستراتيجية. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-violet-500" /> 
            استراتيجيات الذكاء
          </h2>
          <p className="text-slate-400 mt-1">
            محرك تفكير عميق لإنشاء خطط عمل استراتيجية ومفصلة (Gemini 3 Pro Thinking Mode).
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700 flex items-center shadow-lg">
           <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleThink()}
              placeholder="مثلاً: 'استراتيجية تسويق لعلامة تجارية للأزياء المستدامة تستهدف السعودية'..."
              className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-base"
           />
           <button
              onClick={handleThink}
              disabled={loading || !topic}
              className="bg-gradient-to-l from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 py-2.5 m-1 rounded-lg font-medium shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
           >
             {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
             <span>تخطيط</span>
           </button>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 overflow-y-auto relative custom-scrollbar shadow-inner">
           {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10">
                <div className="relative">
                   <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                   <BrainCircuit size={64} className="text-violet-400 animate-pulse relative z-10" />
                </div>
                <div className="text-center space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white">جاري التفكير بعمق...</h3>
                  <p className="text-slate-400 text-sm">يقوم Gemini بتحليل المعطيات، هيكلة الاستراتيجية، وصياغة خطة عمل شاملة. هذا قد يستغرق دقيقة.</p>
                  <div className="inline-block bg-violet-900/30 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/20 mt-2">
                    Thinking Budget: 32k Tokens
                  </div>
                </div>
             </div>
           ) : plan ? (
             <div className="animate-fade-in pb-10">
               <MarkdownRenderer content={plan} />
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
               <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-2">
                 <BrainCircuit size={40} className="opacity-40" />
               </div>
               <div className="text-center max-w-sm">
                  <p className="text-lg font-medium text-slate-400 mb-1">ابدأ رحلتك الاستراتيجية</p>
                  <p className="text-sm">أدخل فكرة مشروعك أو التحدي الذي تواجهه للحصول على خارطة طريق مفصلة.</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanner;