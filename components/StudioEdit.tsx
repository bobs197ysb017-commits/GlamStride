import React, { useState, useRef } from 'react';
import { Upload, Loader2, Wand2, Download } from 'lucide-react';
import { editImage } from '../services/geminiService';

const StudioEdit: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setEditedImage(null); // Reset edited image when new one loaded
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt.trim()) return;
    setLoading(true);
    try {
      const result = await editImage(image, prompt);
      setEditedImage(result);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "فشل في تعديل الصورة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white">المحرر السحري</h2>
        <p className="text-slate-400">حول صورك باستخدام أوامر نصية بسيطة باستخدام Nano Banana (Gemini 2.5 Flash Image).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">الأصل</h3>
          <div 
            className={`border-2 border-dashed border-slate-700 rounded-xl min-h-[300px] flex items-center justify-center relative overflow-hidden transition-colors ${!image ? 'hover:bg-slate-800/50 cursor-pointer' : ''}`}
            onClick={() => !image && fileInputRef.current?.click()}
          >
            {image ? (
              <>
                <img src={image} alt="Original" className="w-full h-full object-contain" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImage(null); }}
                  className="absolute top-2 left-2 bg-slate-900/80 text-white p-1 rounded-full hover:bg-red-500/80 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <Upload className="mx-auto h-12 w-12 text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">اضغط للرفع أو اسحب وأفلت</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="flex gap-2">
             <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثلاً: 'أضف فلتر ريترو'، 'اجعل الجو مثلجاً'"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
             />
             <button
                onClick={handleEdit}
                disabled={!image || loading || !prompt}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
               تعديل
             </button>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">النتيجة</h3>
          <div className="border border-slate-700 bg-slate-900 rounded-xl min-h-[300px] flex items-center justify-center overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
                <p className="text-sm text-white">جاري تطبيق السحر...</p>
              </div>
            )}
            
            {editedImage ? (
               <div className="relative w-full h-full group">
                  <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={editedImage} 
                      download="glamstride-edited.png"
                      className="bg-black/70 hover:bg-black text-white p-2 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm"
                    >
                      <Download size={16} /> تحميل
                    </a>
                  </div>
               </div>
            ) : (
              <div className="text-slate-600 flex items-center gap-2">
                <Wand2 size={24} className="opacity-20" />
                <p className="text-sm">الصورة المعدلة ستظهر هنا</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioEdit;