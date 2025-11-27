import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudioGen from './components/StudioGen';
import StudioEdit from './components/StudioEdit';
import MarketResearch from './components/MarketResearch';
import BusinessPlanner from './components/BusinessPlanner';
import QuickCopy from './components/QuickCopy';
import Assistant from './components/Assistant';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             <div className="col-span-full mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">مرحباً بك في GlamStride</h2>
                <p className="text-slate-400">مركز التحكم بمتجرك الإلكتروني المدعوم بالذكاء الاصطناعي.</p>
             </div>

             <DashboardCard 
                title="إنشاء الصور" 
                desc="صمم صور منتجات واقعية واحترافية باستخدام Nano Banana."
                action={() => setActiveTab(AppTab.STUDIO_GEN)}
                color="from-pink-500 to-rose-500"
             />
             <DashboardCard 
                title="تعديل الصور" 
                desc="عدل الصور فوراً باستخدام الأوامر النصية و Nano Banana."
                action={() => setActiveTab(AppTab.STUDIO_EDIT)}
                color="from-purple-500 to-indigo-500"
             />
             <DashboardCard 
                title="صيحات السوق" 
                desc="اكتشف أحدث صيحات الموضة مع بحث جوجل المدعوم."
                action={() => setActiveTab(AppTab.MARKET_RESEARCH)}
                color="from-blue-500 to-cyan-500"
             />
             <DashboardCard 
                title="استراتيجية عميقة" 
                desc="خطط للمستقبل بتفكير عميق ومنطقي للمهام المعقدة."
                action={() => setActiveTab(AppTab.STRATEGY)}
                color="from-emerald-500 to-teal-500"
             />
             <DashboardCard 
                title="نصوص سريعة" 
                desc="أنشئ عناوين تسويقية جذابة بسرعة فائقة."
                action={() => setActiveTab(AppTab.QUICK_COPY)}
                color="from-amber-500 to-orange-500"
             />
             <DashboardCard 
                title="المساعد الذكي" 
                desc="احصل على المساعدة والدعم في بناء متجرك."
                action={() => setActiveTab(AppTab.ASSISTANT)}
                color="from-slate-500 to-slate-600"
             />
          </div>
        );
      case AppTab.STUDIO_GEN:
        return <StudioGen />;
      case AppTab.STUDIO_EDIT:
        return <StudioEdit />;
      case AppTab.MARKET_RESEARCH:
        return <MarketResearch />;
      case AppTab.STRATEGY:
        return <BusinessPlanner />;
      case AppTab.QUICK_COPY:
        return <QuickCopy />;
      case AppTab.ASSISTANT:
        return <Assistant />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto h-screen relative">
        {renderContent()}
      </main>
    </div>
  );
};

const DashboardCard: React.FC<{ title: string, desc: string, action: () => void, color: string }> = ({ title, desc, action, color }) => (
  <button 
    onClick={action}
    className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-start hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50 transition-all group"
  >
    <div className={`h-2 w-12 rounded-full bg-gradient-to-l ${color} mb-4`}></div>
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </button>
);

export default App;