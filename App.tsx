import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudioGen from './components/StudioGen';
import StudioEdit from './components/StudioEdit';
import MarketResearch from './components/MarketResearch';
import BusinessPlanner from './components/BusinessPlanner';
import QuickCopy from './components/QuickCopy';
import Assistant from './components/Assistant';
import TaskBoard from './components/TaskBoard';
import HistoryLog from './components/HistoryLog';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in pb-10">
             {/* Welcome Banner - Spans 2 cols on LG */}
             <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                   <h2 className="text-3xl font-bold text-white mb-3">مرحباً بك في GlamStride</h2>
                   <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                     مركز التحكم المتكامل لمتجرك الإلكتروني. استخدم أدوات الذكاء الاصطناعي لإنشاء محتوى احترافي وتطوير أعمالك.
                   </p>
                </div>
             </div>

             {/* Task Board Widget - Spans 1 col, 2 rows on LG */}
             <div className="col-span-1 md:col-span-full lg:col-span-1 lg:row-span-2 min-h-[300px]">
                <TaskBoard />
             </div>

             {/* Tools Cards */}
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
      case AppTab.HISTORY:
        return <HistoryLog />;
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
    className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-start hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50 transition-all group h-full flex flex-col"
  >
    <div className={`h-2 w-12 rounded-full bg-gradient-to-l ${color} mb-4`}></div>
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </button>
);

export default App;