import React, { useState } from 'react';
import { WardrobeItem, ClosetLocation, CapsuleWardrobe } from '../types/wardrobe';
import { 
  TrendingDown, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Glasses, 
  Watch, 
  Footprints, 
  Briefcase,
  Layers
} from 'lucide-react';

interface ClosetViewProps {
  items: WardrobeItem[];
  currentCapsule: CapsuleWardrobe;
  onSelectItem: (item: WardrobeItem) => void;
  onOpenImport: () => void;
  onOpenTryOn: (item: WardrobeItem) => void;
  onOpenStylist: () => void;
}

export const ClosetView: React.FC<ClosetViewProps> = ({
  items,
  currentCapsule,
  onSelectItem,
  onOpenImport,
  onOpenTryOn,
  onOpenStylist,
}) => {
  const [activeDrawer, setActiveDrawer] = useState<'shoes' | 'bags' | 'pants' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Filter items by capsule if not 'main'
  const capsuleItems = items.filter(item => {
    const matchesCapsule = currentCapsule.id === 'main' || item.capsuleIds.includes(currentCapsule.id);
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = selectedSeason === 'All' || item.season === selectedSeason;
    return matchesCapsule && matchesSearch && matchesSeason;
  });

  // Segregate by closet physical location
  const topShelfItems = capsuleItems.filter(i => i.closetLocation === 'top_shelf');
  const railItems = capsuleItems.filter(i => i.closetLocation === 'clothes_rail');
  const shoeItems = capsuleItems.filter(i => i.closetLocation === 'drawer_shoes');
  const bagItems = capsuleItems.filter(i => i.closetLocation === 'drawer_bags');
  const pantItems = capsuleItems.filter(i => i.closetLocation === 'drawer_pants');

  const handleToggleDrawer = (drawer: 'shoes' | 'bags' | 'pants') => {
    setActiveDrawer(prev => prev === drawer ? null : drawer);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Capsule Banner & Search Header */}
      <div className="bg-white/80 rounded-2xl p-5 border border-[#E6E2DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Active Capsule</span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              {currentCapsule.season}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1">{currentCapsule.name}</h2>
          <p className="text-xs text-neutral-500 max-w-xl mt-0.5">{currentCapsule.description}</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fabric, brand, piece..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8F7F4] border border-[#E6E2DC] rounded-xl pl-9 pr-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F8F7F4] p-1 rounded-xl border border-[#E6E2DC] text-xs">
            {['All', 'Autumn', 'Winter', 'Spring', 'Summer'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap text-[11px] ${
                  selectedSeason === s
                    ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CLOSET CONTAINER: Hyper-Realistic Virtual Walk-in Closet */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D9D4CC] bg-[#F4F1EA] shadow-xl">
        {/* Subtle architectural background texture and lighting header */}
        <div className="h-6 bg-gradient-to-r from-[#D8D2C6] via-[#E8E3DA] to-[#D8D2C6] border-b border-[#CFC8BC] flex items-center justify-between px-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
            Nordic Oak & Brushed Brass Installation
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
            <span className="text-[10px] text-neutral-500">Ambient Studio 3200K</span>
          </div>
        </div>

        {/* 1. TOP ACCESSORY SHELF */}
        <section className="relative px-6 py-5 bg-[#EFECE5] border-b border-[#DDD8CD]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Glasses className="w-4 h-4 text-neutral-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Top Accessory Shelf
              </h3>
              <span className="text-[11px] text-neutral-400">({topShelfItems.length} curated pieces)</span>
            </div>
            <span className="text-[11px] text-neutral-500 italic hidden sm:inline">
              Swipe horizontally to inspect accessories
            </span>
          </div>

          {/* Wooden Shelf Surface Base */}
          <div className="relative">
            {/* Shelf Wood Texture Plinth */}
            <div className="flex gap-4 overflow-x-auto pb-3 pt-2 scrollbar-none snap-x">
              {topShelfItems.length === 0 ? (
                <div className="w-full py-6 text-center text-xs text-neutral-400 italic bg-white/40 rounded-xl border border-dashed border-[#DDD8CD]">
                  No accessories filed on this shelf yet. Use the camera import to add hats, sunglasses, or jewelry.
                </div>
              ) : (
                topShelfItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="group snap-start shrink-0 w-44 bg-white/90 hover:bg-white rounded-xl p-3 border border-[#E0DCD3] hover:border-neutral-800 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <div className="relative h-24 w-full flex items-center justify-center bg-[#F8F7F4] rounded-lg p-2 overflow-hidden mb-2">
                      {item.priceDropPercent && (
                        <span className="absolute top-1.5 left-1.5 bg-[#10B981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                          -{item.priceDropPercent}%
                        </span>
                      )}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-20 w-auto object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">{item.brand}</span>
                      <h4 className="text-xs font-semibold text-neutral-900 truncate">{item.title}</h4>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-neutral-900">${item.price}</span>
                        <span className="text-[10px] text-neutral-500">{item.style}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            {/* Wooden shelf edge trim */}
            <div className="h-2 w-full bg-gradient-to-r from-[#BAAF9D] via-[#D3C8B6] to-[#BAAF9D] rounded-full mt-1 shadow-inner" />
          </div>
        </section>

        {/* 2. CENTRAL AREA: THE SMART CLOTHES RAIL */}
        <section className="relative px-6 pt-6 pb-12 bg-gradient-to-b from-[#F2EFE8] to-[#E9E5DC] min-h-[460px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                The Smart Clothes Rail
              </h3>
              <span className="text-[11px] text-neutral-500">
                ({railItems.length} hanging coats, blazers & knits)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenStylist}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-800 hover:text-black font-medium underline underline-offset-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Style Full Outfit</span>
              </button>
            </div>
          </div>

          {/* PHYSICAL BRASS CLOTHING RAIL BAR */}
          <div className="relative my-4">
            {/* Wall Mount Brackets */}
            <div className="absolute -top-3 left-0 w-3 h-6 bg-[#A8987E] rounded-sm shadow-md" />
            <div className="absolute -top-3 right-0 w-3 h-6 bg-[#A8987E] rounded-sm shadow-md" />
            
            {/* Cylindrical Rail Rod with metallic sheen */}
            <div className="h-3 w-full bg-gradient-to-b from-[#E2D2B8] via-[#C9B696] to-[#9E8867] rounded-full shadow-md border-t border-[#F5EBD7]" />

            {/* HANGING CLOTHES ROW */}
            <div className="relative pt-1 flex items-start gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x px-2">
              {railItems.length === 0 ? (
                <div className="w-full py-16 text-center text-xs text-neutral-500 italic bg-white/30 rounded-2xl border border-dashed border-[#DDD8CD] my-6">
                  The clothes rail is empty for this filter. Tap "Capture / Import Look" above to add tailored coats or knits.
                </div>
              ) : (
                railItems.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={`group snap-center shrink-0 w-52 sm:w-60 flex flex-col items-center cursor-pointer select-none transition-transform duration-300 hover:scale-102 ${
                        isEven ? 'animate-sway' : 'animate-sway-delayed'
                      } hover:animate-none`}
                    >
                      {/* Brass Hanger Hook */}
                      <div className="w-5 h-7 border-t-2 border-r-2 border-[#BCA585] rounded-tr-full -mb-1 transform -rotate-6 group-hover:rotate-0 transition-transform" />

                      {/* Natural Curved Wooden Hanger Body */}
                      <div className="w-36 h-3 bg-gradient-to-r from-[#A78B6C] via-[#C8AF93] to-[#A78B6C] rounded-full shadow-sm relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5A4530]" />
                      </div>

                      {/* Item Container with Transparent Sticker Effect & Price Drop Badge */}
                      <div className="relative mt-1 bg-white/80 group-hover:bg-white rounded-2xl p-4 border border-[#DDD8CD] group-hover:border-neutral-900 transition-all shadow-md group-hover:shadow-xl w-full flex flex-col items-center">
                        {/* Price drop flashing smart badge */}
                        {item.priceDropPercent && (
                          <div className="absolute -top-2.5 right-3 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                            <TrendingDown className="w-3 h-3" />
                            <span>{item.priceDropPercent}% OFF</span>
                          </div>
                        )}

                        {/* Garment Cutout Imagery */}
                        <div className="h-44 w-full flex items-center justify-center overflow-hidden py-1">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-h-40 w-auto object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Item Details Tag */}
                        <div className="w-full mt-3 pt-2.5 border-t border-[#F0ECE4] text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                              {item.brand}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium">{item.fabric.split(' ')[0]}</span>
                          </div>
                          <h4 className="text-xs font-semibold text-neutral-900 truncate mt-0.5">
                            {item.title}
                          </h4>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold font-mono text-[#1A1A1A]">${item.price}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenTryOn(item);
                              }}
                              className="text-[11px] font-semibold text-neutral-800 bg-neutral-100 hover:bg-[#1A1A1A] hover:text-white px-2 py-1 rounded-md transition-colors"
                            >
                              Try On
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-center text-[11px] text-neutral-500 italic mt-2">
            Hanging garments sway naturally. Click any garment to view store comparisons, dupe alternatives, or virtual try-on.
          </div>
        </section>

        {/* 3. BOTTOM DRAWERS: SHOES, BAGS, PANTS */}
        <section className="bg-[#E5E1D7] border-t border-[#DDD8CD] p-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Interactive Storage Drawers
            </h3>
            <span className="text-[11px] text-neutral-500">Tap a drawer handle to slide open</span>
          </div>

          {/* 3 Drawer Handles Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Drawer 1: Shoes */}
            <button
              onClick={() => handleToggleDrawer('shoes')}
              className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between shadow-xs ${
                activeDrawer === 'shoes'
                  ? 'bg-white border-neutral-900 ring-1 ring-neutral-900'
                  : 'bg-[#F2EFE8] hover:bg-white border-[#DDD8CD]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-200/80 flex items-center justify-center">
                  <Footprints className="w-4 h-4 text-neutral-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Footwear & Shoes</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{shoeItems.length} Pairs Stored</span>
                </div>
              </div>
              {activeDrawer === 'shoes' ? (
                <ChevronUp className="w-4 h-4 text-neutral-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Drawer 2: Bags */}
            <button
              onClick={() => handleToggleDrawer('bags')}
              className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between shadow-xs ${
                activeDrawer === 'bags'
                  ? 'bg-white border-neutral-900 ring-1 ring-neutral-900'
                  : 'bg-[#F2EFE8] hover:bg-white border-[#DDD8CD]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-200/80 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-neutral-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Bags & Leathergoods</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{bagItems.length} Bags Stored</span>
                </div>
              </div>
              {activeDrawer === 'bags' ? (
                <ChevronUp className="w-4 h-4 text-neutral-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Drawer 3: Pants */}
            <button
              onClick={() => handleToggleDrawer('pants')}
              className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between shadow-xs ${
                activeDrawer === 'pants'
                  ? 'bg-white border-neutral-900 ring-1 ring-neutral-900'
                  : 'bg-[#F2EFE8] hover:bg-white border-[#DDD8CD]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-200/80 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-neutral-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Pants & Trousers</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{pantItems.length} Trousers Stored</span>
                </div>
              </div>
              {activeDrawer === 'pants' ? (
                <ChevronUp className="w-4 h-4 text-neutral-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>
          </div>

          {/* OPEN DRAWER CONTENT EXPANSION */}
          {activeDrawer && (
            <div className="mt-4 p-5 bg-white rounded-2xl border border-neutral-300 shadow-inner animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0ECE4]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Opened Drawer: {activeDrawer === 'shoes' ? 'Shoes & Footwear' : activeDrawer === 'bags' ? 'Designer Handbags' : 'Trousers & Denim'}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Click any piece to inspect material composition, retail dupe options, or send to Virtual Try-On.
                  </p>
                </div>
                <button
                  onClick={() => setActiveDrawer(null)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-medium px-2.5 py-1 rounded-lg hover:bg-neutral-100"
                >
                  Close Drawer
                </button>
              </div>

              {/* Drawer Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(activeDrawer === 'shoes' ? shoeItems : activeDrawer === 'bags' ? bagItems : pantItems).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="group bg-[#F8F7F4] hover:bg-white p-3 rounded-xl border border-[#E6E2DC] hover:border-neutral-900 transition-all text-left shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-28 w-full flex items-center justify-center bg-white rounded-lg p-2 mb-2">
                      {item.priceDropPercent && (
                        <span className="absolute top-1.5 left-1.5 bg-[#10B981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                          -{item.priceDropPercent}%
                        </span>
                      )}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-24 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{item.brand}</span>
                      <h5 className="text-xs font-semibold text-neutral-900 truncate">{item.title}</h5>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-neutral-900">${item.price}</span>
                        <span className="text-[10px] text-neutral-500">{item.fabric.split(' ')[0]}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
