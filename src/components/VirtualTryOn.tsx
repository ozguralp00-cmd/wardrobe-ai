import React, { useState } from 'react';
import { WardrobeItem } from '../types/wardrobe';
import { TRYON_MODEL_IMAGE } from '../data/mockWardrobe';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Sliders, 
  Check, 
  Share2, 
  Info,
  Maximize2,
  ChevronRight,
  Eye,
  Shirt
} from 'lucide-react';

interface VirtualTryOnProps {
  closetItems: WardrobeItem[];
  preselectedItem?: WardrobeItem | null;
  onOpenItemDetail: (item: WardrobeItem) => void;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  closetItems,
  preselectedItem,
  onOpenItemDetail,
}) => {
  // Currently equipped garments
  const coats = closetItems.filter(i => i.category === 'coats_jackets');
  const knits = closetItems.filter(i => i.category === 'tops_knitwear');
  const pants = closetItems.filter(i => i.category === 'pants_trousers');
  const shoes = closetItems.filter(i => i.category === 'shoes');
  const bags = closetItems.filter(i => i.category === 'bags');

  const [selectedCoat, setSelectedCoat] = useState<WardrobeItem | null>(
    preselectedItem?.category === 'coats_jackets' ? preselectedItem : coats[0] || null
  );
  const [selectedTop, setSelectedTop] = useState<WardrobeItem | null>(
    preselectedItem?.category === 'tops_knitwear' ? preselectedItem : knits[0] || null
  );
  const [selectedPants, setSelectedPants] = useState<WardrobeItem | null>(
    preselectedItem?.category === 'pants_trousers' ? preselectedItem : pants[0] || null
  );

  // VTO Engine Parameters
  const [drapeSimulation, setDrapeSimulation] = useState<boolean>(true);
  const [ambientLightingMatch, setAmbientLightingMatch] = useState<number>(85); // 0 - 100
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'fitted' | 'split_comparison'>('fitted');

  const handleEquipGarment = (item: WardrobeItem) => {
    setIsProcessing(true);
    if (item.category === 'coats_jackets') {
      setSelectedCoat(item.id === selectedCoat?.id ? null : item);
    } else if (item.category === 'tops_knitwear') {
      setSelectedTop(item.id === selectedTop?.id ? null : item);
    } else if (item.category === 'pants_trousers') {
      setSelectedPants(item.id === selectedPants?.id ? null : item);
    }
    setTimeout(() => {
      setIsProcessing(false);
    }, 400);
  };

  const totalPrice = (selectedCoat?.price || 0) + (selectedTop?.price || 0) + (selectedPants?.price || 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white/80 rounded-2xl p-5 border border-[#E6E2DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
              Diffusion Changing Room
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>OOTDiffusion & CatVTON Neural Drape</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1">Virtual Try-On Fitting Room</h2>
          <p className="text-xs text-neutral-500 max-w-2xl mt-0.5">
            Wear any garment from your physical closet or social media saves. The neural rendering pipeline maps fabric tension, seam alignments, lighting shadows, and natural body contours.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#F4F1EA] rounded-xl border border-[#DDD8CD] text-xs">
            <button
              onClick={() => setViewMode('fitted')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                viewMode === 'fitted' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Fitted Look
            </button>
            <button
              onClick={() => setViewMode('split_comparison')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                viewMode === 'split_comparison' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Side-by-Side Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Main Fitting Room Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Stage: Model Viewport with Rendered Garments & Physics Overlays */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE8]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Studio Viewport · Travertine Suite
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
              <span>Body Profile: Model A (175cm / Size S)</span>
            </div>
          </div>

          {/* Model Display Canvas */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#ECE8DF] flex items-center justify-center min-h-[580px]">
            {/* Base Model Photo */}
            <img
              src={TRYON_MODEL_IMAGE}
              alt="Model standing in neutral posture"
              className="w-full h-auto max-h-[620px] object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />

            {/* In-flight Latent Neural Inpainting indicator */}
            {isProcessing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-neutral-900">
                  Synthesizing Fabric Drape & Lighting Shadows...
                </span>
              </div>
            )}

            {/* Fitted Garments Hologram / Overlay Labels */}
            <div className="absolute top-4 left-4 space-y-2 z-10 pointer-events-none">
              {selectedCoat && (
                <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Layer 1 (Outer): {selectedCoat.title}</span>
                </div>
              )}
              {selectedTop && (
                <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-blue-300" />
                  <span>Layer 2 (Inner): {selectedTop.title}</span>
                </div>
              )}
              {selectedPants && (
                <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Layer 3 (Bottom): {selectedPants.title}</span>
                </div>
              )}
            </div>

            {/* Neural Fabric Tension & Contour Overlay Indicator */}
            {drapeSimulation && (
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-200 text-[11px] text-neutral-700 font-medium flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Neural Drape Active: 98% Body Alignment</span>
              </div>
            )}
          </div>

          {/* Fit Assessment Breakdown Strip */}
          <div className="p-4 bg-[#F8F7F4] rounded-2xl border border-[#E6E2DC] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Shoulder Span</span>
              <span className="font-semibold text-neutral-900">True to Size (38cm)</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Waist Tension</span>
              <span className="font-semibold text-neutral-900">Relaxed Slouch (+2cm)</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Coat Drop</span>
              <span className="font-semibold text-neutral-900">Calf Graze (118cm)</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Confidence</span>
              <span className="font-semibold text-emerald-700">99.2% Realistic</span>
            </div>
          </div>
        </div>

        {/* Right Stage: Wardrobe Layer Selector & VTO Physics Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* VTO Physics & Lighting Tuning */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              VTO Simulation Parameters
            </h4>

            {/* Drape toggle */}
            <div className="flex items-center justify-between p-3 bg-[#F8F7F4] rounded-xl border border-[#EAE6DF]">
              <div>
                <span className="text-xs font-semibold text-neutral-900 block">
                  Gravitational Fabric Drape
                </span>
                <span className="text-[11px] text-neutral-500">
                  Simulates natural creases and fabric weight
                </span>
              </div>
              <button
                onClick={() => setDrapeSimulation(prev => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  drapeSimulation ? 'bg-[#1A1A1A]' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    drapeSimulation ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Studio Lighting Blend Slider */}
            <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#EAE6DF] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900">Ambient Lighting Blend</span>
                <span className="font-mono text-neutral-600">{ambientLightingMatch}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={ambientLightingMatch}
                onChange={(e) => setAmbientLightingMatch(Number(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
            </div>
          </div>

          {/* Layer 1: Coats & Jackets Selection */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Outerwear Layer ({coats.length})
              </h4>
              <span className="text-[11px] text-neutral-500">Tap to toggle on/off</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {coats.map((item) => {
                const isEquipped = selectedCoat?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquipGarment(item)}
                    className={`p-2 rounded-xl border transition-all text-left flex flex-col items-center cursor-pointer ${
                      isEquipped
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-[#E6E2DC] bg-[#F8F7F4] hover:bg-white text-neutral-900'
                    }`}
                  >
                    <div className="h-16 w-full flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-14 w-auto object-contain filter drop-shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-semibold truncate w-full text-center mt-1">
                      {item.brand}
                    </span>
                    <span className="text-[9px] opacity-70 font-mono">${item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layer 2: Tops & Knitwear Selection */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Inner Top & Knitwear ({knits.length})
              </h4>
              <span className="text-[11px] text-neutral-500">Tap to equip</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {knits.map((item) => {
                const isEquipped = selectedTop?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquipGarment(item)}
                    className={`p-2 rounded-xl border transition-all text-left flex flex-col items-center cursor-pointer ${
                      isEquipped
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-[#E6E2DC] bg-[#F8F7F4] hover:bg-white text-neutral-900'
                    }`}
                  >
                    <div className="h-16 w-full flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-14 w-auto object-contain filter drop-shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-semibold truncate w-full text-center mt-1">
                      {item.brand}
                    </span>
                    <span className="text-[9px] opacity-70 font-mono">${item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layer 3: Bottom Trousers Selection */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Trousers & Denim ({pants.length})
              </h4>
              <span className="text-[11px] text-neutral-500">Tap to equip</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {pants.map((item) => {
                const isEquipped = selectedPants?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquipGarment(item)}
                    className={`p-2.5 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      isEquipped
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-[#E6E2DC] bg-[#F8F7F4] hover:bg-white text-neutral-900'
                    }`}
                  >
                    <div className="h-12 w-12 shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-10 w-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-semibold block truncate">{item.title}</span>
                      <span className="text-[9px] opacity-70 font-mono">${item.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary / Total Cost & Save Look */}
          <div className="bg-[#1A1A1A] text-white rounded-3xl p-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block">
                  Total Fitted Ensemble
                </span>
                <span className="text-xl font-serif font-bold text-white">Curated Look</span>
              </div>
              <span className="text-2xl font-bold font-mono text-white">${totalPrice}</span>
            </div>

            <button
              onClick={() => {
                alert('Curated Look saved to your Summer Vacation Capsule!');
              }}
              className="w-full py-2.5 bg-white text-neutral-900 text-xs font-bold rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Save Ensemble to Capsule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
