import React, { useEffect, useState } from 'react';
import { Clock, Trash2, Image as ImageIcon, Wand2, TrendingUp, BrainCircuit, Zap, ExternalLink, FileText } from 'lucide-react';
import { HistoryItem, HistoryType } from '../types';
import { getHistory, clearHistory, deleteHistoryItem } from '../utils/history';

const HistoryLog: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<HistoryType | 'ALL'>('ALL');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setItems(getHistory());
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من حذف السجل بالكامل؟')) {
      clearHistory();
      setItems([]);
    }
  };

  const handleDeleteItem = (id: string) => {
    deleteHistoryItem(id);
    setItems(items.filter(i => i.id !== id));
  };

  const getIcon = (type: HistoryType) => {
    switch (type) {
      case 'IMAGE_GEN': return <ImageIcon size={16} className="text-pink-400" />;
      case 'IMAGE_EDIT': return <Wand2 size={16} className="text-violet-400" />;
      case 'MARKET_RESEARCH': return <TrendingUp size={16} className="text-blue-400" />;
      case 'STRATEGY': return <BrainCircuit size={16} className="text-emerald-400" />;
      case 'QUICK_COPY': return <Zap size={16} className="text-amber-400" />;
      default: return <Clock size={16} />;
    }
  };

  const getLabel = (type: HistoryType) => {
    switch (type) {
      case 'IMAGE_GEN': return 'إنشاء صورة';
      case 'IMAGE_EDIT': return 'تعديل صورة';
      case 'MARKET_RESEARCH': return 'بحث سوقي';
      case 'STRATEGY': return 'استراتيجية';
      case 'QUICK_COPY': return 'نص سريع';
    }
  };

  const filteredItems = filter === 'ALL' ? items : items.filter(i => i.type === filter);

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="text-slate-400" />
            سجل النشاطات
          </h2>
          <p className="text-slate-400 mt-1">تتبع جميع عمليات الإنشاء والبحث والتعديل السابقة.</p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors text-sm"
          >
            <Trash2 size={16} />
            مسح الكل
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        <FilterButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="الكل" />
        <FilterButton active={filter === 'IMAGE_GEN'} onClick={() => setFilter('IMAGE_GEN')} label="الصور" icon={<ImageIcon size={14} />} />
        <FilterButton active={filter === 'IMAGE_EDIT'} onClick={() => setFilter('IMAGE_EDIT')} label="التعديلات" icon={<Wand2 size={14} />} />
        <FilterButton active={filter === 'MARKET_RESEARCH'} onClick={() => setFilter('MARKET_RESEARCH')} label="الأبحاث" icon={<TrendingUp size={14} />} />
        <FilterButton active={filter === 'STRATEGY'} onClick={() => setFilter('STRATEGY')} label="الاستراتيجيات" icon={<BrainCircuit size={14} />} />
        <FilterButton active={filter === 'QUICK_COPY'} onClick={() => setFilter('QUICK_COPY')} label="النصوص" icon={<Zap size={14} />} />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/50 rounded-xl p-2">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
            <Clock size={48} className="opacity-20" />
            <p>لا توجد سجلات لعرضها حالياً.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-700/50 mt-1">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {getLabel(item.type)}
                      </span>
                      <span className="text-xs text-slate-500" dir="ltr">
                        {new Date(item.timestamp).toLocaleString('ar-SA')}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-200 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{item.details}</p>
                    
                    {/* Result Preview */}
                    {item.result && (
                      <div className="mt-3 bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                        {item.type === 'IMAGE_GEN' || item.type === 'IMAGE_EDIT' ? (
                          <div className="relative h-32 w-full sm:w-48 overflow-hidden rounded-md bg-slate-950">
                            <img src={item.result} alt="Result" className="w-full h-full object-cover" />
                            <a 
                              href={item.result} 
                              download={`history-${item.id}.png`}
                              className="absolute bottom-1 right-1 bg-black/60 p-1.5 rounded-md text-white hover:bg-black/80 transition-colors"
                              title="تحميل"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <p className="line-clamp-3 text-slate-300 text-xs whitespace-pre-wrap">{item.result}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 p-2"
                  title="حذف من السجل"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
      active 
        ? 'bg-slate-200 text-slate-900 border-slate-200' 
        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default HistoryLog;