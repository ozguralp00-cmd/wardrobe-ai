import React from 'react';
import { CapsuleWardrobe } from '../types/wardrobe';
import { Camera, FileText, ChevronDown, Bell, Sparkles } from 'lucide-react';

export type ActiveTab = 'closet' | 'scanner' | 'tryon' | 'stylist' | 'price_watch';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  capsules: CapsuleWardrobe[];
  selectedCapsuleId: string;
  onSelectCapsule: (capsuleId: string) => void;
  onOpenImport: () => void;
  onOpenBlueprint: () => void;
  priceDropCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  capsules,
  selectedCapsuleId,
  onSelectCapsule,
  onOpenImport,
  onOpenBlueprint,
  priceDropCount,
}) => {
  const currentCapsule = capsules.find(c => c.id === selectedCapsuleId) || capsules[0];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E6E2DC]">
      {/* Primary Top Bar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Capsule Switcher */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => onSelectTab('closet')}
            className="flex items-baseline gap-1.5 text-left group"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A] group-hover:opacity-80 transition-opacity">
              ATELIER
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hidden sm:inline">
              Wardrobe Studio
            </span>
          </button>

          {/* Capsule Switcher Dropdown */}
          <div className="relative group">
            <select
              value={selectedCapsuleId}
              onChange={(e) => onSelectCapsule(e.target.value)}
              className="appearance-none bg-white/80 hover:bg-white text-xs font-medium text-neutral-800 border border-[#E6E2DC] rounded-full pl-3 pr-7 py-1.5 cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
            >
              {capsules.map((capsule) => (
                <option key={capsule.id} value={capsule.id}>
                  {capsule.name} ({capsule.itemCount})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line editorial tabs) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#EFECE6]/70 p-1 rounded-xl border border-[#E6E2DC]">
          <button
            onClick={() => onSelectTab('closet')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'closet'
                ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
            }`}
          >
            Virtual Walk-In Closet
          </button>

          <button
            onClick={() => onSelectTab('scanner')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Visual Scanner</span>
          </button>

          <button
            onClick={() => onSelectTab('tryon')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'tryon'
                ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
            }`}
          >
            Virtual Try-On Room
          </button>

          <button
            onClick={() => onSelectTab('stylist')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'stylist'
                ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
            }`}
          >
            AI Stylist
          </button>

          <button
            onClick={() => onSelectTab('price_watch')}
            className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'price_watch'
                ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            <span>Price Watch</span>
            {priceDropCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#10B981] text-white text-[10px] font-bold rounded-full">
                {priceDropCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions (Camera Import & Master Blueprint) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenBlueprint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-800 bg-white border border-[#E6E2DC] rounded-xl hover:bg-neutral-50 transition-colors shadow-xs"
            title="Open Master Product Specification & System Architecture Blueprint"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden lg:inline">Master Blueprint & Specs</span>
            <span className="lg:hidden">Specs</span>
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#1A1A1A] rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-sm"
          >
            <Camera className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">Capture / Import Look</span>
            <span className="sm:hidden">Import</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-[#E6E2DC] bg-[#F4F2ED] overflow-x-auto">
        <button
          onClick={() => onSelectTab('closet')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'closet' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          Closet
        </button>
        <button
          onClick={() => onSelectTab('scanner')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'scanner' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          AI Scanner
        </button>
        <button
          onClick={() => onSelectTab('tryon')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'tryon' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          Try-On
        </button>
        <button
          onClick={() => onSelectTab('stylist')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'stylist' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          Stylist
        </button>
        <button
          onClick={() => onSelectTab('price_watch')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'price_watch' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          Price Watch ({priceDropCount})
        </button>
      </div>
    </header>
  );
};
