import React, { useState } from 'react';
import { Search, Loader2, Globe, ArrowLeft, TrendingUp, ShoppingBag } from 'lucide-react';
import { searchMarketTrends } from '../services/geminiService';
import { GroundingMetadata } from '../types';

const MarketResearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'trend' | 'product'>('trend');
  const [results, setResults] = useState<{ text: string, grounding?: GroundingMetadata } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const data = await searchMarketTrends(query, searchType);
      setResults({ text: data.text, grounding: data.groundingMetadata });
    } catch (err) {
      console.error(err);
      setResults({ text: "خطأ في جلب بيانات السوق.", grounding: undefined });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white transition-all duration-300">
          {searchType === 'trend' ? 'كاشف الصيحات' : 'مكتشف المنتجات'}
        </h2>
        <p className="text-slate-400 transition-all duration-300">
          {searchType === 'trend' 
            ? 'معلومات سوقية فورية مدعومة ببحث جوجل.' 
            : 'رؤى عميقة حول المنتجات والأسعار والمنافسين.'}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => { setSearchType('trend'); setResults(null); setQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            searchType === 'trend' 
              ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-900/20' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
          }`}
        >
          <TrendingUp size={16} />
          <span>صيحات</span>
        </button>
        <button 
          onClick={() => { setSearchType('product'); setResults(null); setQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            searchType === 'product' 
              ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-900/20' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
          }`}
        >
          <ShoppingBag size={16} />
          <span>منتجات</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className={`absolute -inset-0.5 rounded-xl blur opacity-30 transition duration-500 group-hover:opacity-75 ${
          searchType === 'trend' ? 'bg-gradient-to-l from-violet-600 to-indigo-600' : 'bg-gradient-to-l from-pink-600 to-rose-600'
        }`}></div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchType === 'trend' 
            ? "مثلاً: 'موضة ملابس الصيف 2025'" 
            : "مثلاً: 'أديداس سامبا' أو 'دايسون'"
          }
          className="relative w-full bg-slate-900 border border-slate-700 text-white ps-12 pe-20 py-4 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all shadow-xl"
          style={{
            borderColor: loading ? 'transparent' : '',
            boxShadow: loading ? 'none' : ''
          }}
        />
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={24} />
        <button
          type="submit"
          disabled={loading || !query}
          className={`absolute end-2 top-2 bottom-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-0 z-10 text-white ${
            searchType === 'trend' ? 'bg-violet-600 hover:bg-violet-500' : 'bg-pink-600 hover:bg-pink-500'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <ArrowLeft />}
        </button>
      </form>

      {loading && (
        <div className="space-y-4 animate-pulse">
           <div className="h-4 bg-slate-800 rounded w-3/4"></div>
           <div className="h-4 bg-slate-800 rounded w-full"></div>
           <div className="h-4 bg-slate-800 rounded w-5/6"></div>
        </div>
      )}

      {results && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6 animate-fade-in">
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-slate-200 leading-relaxed">
              {results.text}
            </p>
          </div>

          {results.grounding?.groundingChunks && results.grounding.groundingChunks.length > 0 && (
            <div className="border-t border-slate-700 pt-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe size={12} /> المصادر
              </h4>
              <div className="grid gap-2">
                {results.grounding.groundingChunks.map((chunk, idx) => {
                   if (!chunk.web?.uri) return null;
                   return (
                     <a 
                      key={idx}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900 hover:bg-slate-800 p-3 rounded-lg border border-slate-700 transition-colors group"
                     >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-violet-300 group-hover:text-violet-200 truncate max-w-[400px]">
                            {chunk.web.title || "نتيجة ويب"}
                          </span>
                          <span className="text-xs text-slate-500 truncate max-w-[400px]">
                            {chunk.web.uri}
                          </span>
                        </div>
                        <ArrowLeft size={14} className="text-slate-600 group-hover:text-white" />
                     </a>
                   );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketResearch;