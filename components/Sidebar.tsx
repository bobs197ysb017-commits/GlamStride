import React from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  Wand2, 
  TrendingUp, 
  BrainCircuit, 
  Zap, 
  MessageSquare 
} from 'lucide-react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: AppTab.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: AppTab.STUDIO_GEN, label: 'استوديو التصميم', icon: Palette },
    { id: AppTab.STUDIO_EDIT, label: 'المحرر السحري', icon: Wand2 },
    { id: AppTab.MARKET_RESEARCH, label: 'كاشف الصيحات', icon: TrendingUp },
    { id: AppTab.STRATEGY, label: 'استراتيجيات الذكاء', icon: BrainCircuit },
    { id: AppTab.QUICK_COPY, label: 'نسخ سريع', icon: Zap },
    { id: AppTab.ASSISTANT, label: 'المساعد الذكي', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-e border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-l from-pink-500 to-violet-500 bg-clip-text text-transparent">
          GlamStride
        </h1>
        <p className="text-xs text-slate-500 mt-1">منشئ المتاجر بالذكاء الاصطناعي</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-500 text-center">
          <p>مدعوم بواسطة Gemini 2.5 & 3.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;