import React from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Users, 
  Package, 
  CalendarDays, 
  Shirt, 
  LayoutDashboard, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  Menu,
  X,
  FileDown
} from 'lucide-react';

export type NavigationTab = 
  | 'dashboard' 
  | 'staff' 
  | 'logistics' 
  | 'events' 
  | 'uniforms';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenExport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenExport
}) => {
  const { resetDemoData } = useEvent();

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'events', label: 'Événements & Galas', icon: CalendarDays },
    { id: 'staff', label: 'RH & Profils Extra', icon: Users },
    { id: 'logistics', label: 'Logistique & Stocks', icon: Package },
    { id: 'uniforms', label: 'Vestiaire & Tenues', icon: Shirt },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Professional Polish Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800
        transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => {
              setActiveTab('dashboard');
              setMobileMenuOpen(false);
            }}
          >
            <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center font-serif text-xl font-bold shadow-sm">
              B
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight uppercase text-white block font-serif">
                Blessing Event
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                Art de Recevoir & Protocole
              </span>
            </div>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Modules Opérationnels
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold
                  transition-all duration-150
                  ${isActive 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-xs' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Export Action in Sidebar */}
          {onOpenExport && (
            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={() => {
                  onOpenExport();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700"
              >
                <div className="flex items-center space-x-3">
                  <FileDown className="w-4 h-4 text-amber-400" />
                  <span>Exports & Reporting</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                  PDF / CSV
                </span>
              </button>
            </div>
          )}
        </nav>

        {/* Administrator Profile Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400 shadow-xs">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  Direction Générale
                </p>
                <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-medium">
                  <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">Admin • Pleins Pouvoirs</span>
                </div>
              </div>
            </div>

            <button
              id="reset-demo-btn"
              onClick={() => {
                if (window.confirm('Réinitialiser les données de démonstration Blessing Event ?')) {
                  resetDemoData();
                }
              }}
              title="Réinitialiser les données de démo"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

