import React, { useState } from 'react';
import { Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { generateStandardImage } from '../services/geminiService';
import { AspectRatio } from '../types';
import { addToHistory } from '../utils/history';

// Gemini 2.5 Flash Image only supports these ratios
const RATIOS: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];

const StudioGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const img = await generateStandardImage(prompt, aspectRatio);
      setGeneratedImage(img);
      
      // Save to History
      addToHistory({
        type: 'IMAGE_GEN',
        title: 'إنشاء صورة',
        details: prompt,
        result: img
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "فشل في إنشاء الصورة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white">استوديو التصميم</h2>
        <p className="text-slate-400">قم بإنشاء صور منتجات عالية الجودة ومرئيات أزياء باستخدام Nano Banana (Gemini 2.5 Flash).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 space-y-6 h-fit">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">الوصف (Prompt)</label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none h-32"
              placeholder="مثال: حذاء رياضي مستقبلي يطفو في فضاء نيون..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">الأبعاد (Aspect Ratio)</label>
            <div className="grid grid-cols-3 gap-2">
              {RATIOS.map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`text-xs py-2 rounded-md transition-colors ${
                    aspectRatio === r
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full bg-gradient-to-l from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
            إنشاء
          </button>
        </div>

        {/* Preview */}
        <div className="md:col-span-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center min-h-[400px] overflow-hidden relative group">
          {loading && (
            <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-10">
              <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
              <p className="text-sm text-violet-300 animate-pulse">جاري إنشاء التحفة الفنية...</p>
            </div>
          )}
          
          {generatedImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="max-w-full max-h-[600px] object-contain"
              />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={generatedImage} 
                  download={`glamstride-${Date.now()}.png`}
                  className="bg-black/70 hover:bg-black text-white p-2 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm"
                >
                  <Download size={16} /> تحميل
                </a>
              </div>
            </div>
          ) : (
            <div className="text-slate-600 flex flex-col items-center gap-2 p-6 text-center">
              <ImageIcon size={48} className="opacity-20" />
              <p>ستظهر الصورة المنشأة هنا</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 p-6 text-center z-20">
              <p className="text-red-400 max-w-md">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioGen;