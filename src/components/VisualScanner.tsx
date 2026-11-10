import React, { useState } from 'react';
import { 
  STREET_STYLE_IMAGE, 
  DEMO_STREET_STYLE_BOXES 
} from '../data/mockWardrobe';
import { DetectedBoundingBox, WardrobeItem, ClosetLocation } from '../types/wardrobe';
import { 
  Sparkles, 
  Scan, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  Tag, 
  UploadCloud, 
  Layers, 
  SlidersHorizontal,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface VisualScannerProps {
  onAddItemToCloset: (newItem: WardrobeItem) => void;
  onNavigateToCloset: () => void;
}

export const VisualScanner: React.FC<VisualScannerProps> = ({
  onAddItemToCloset,
  onNavigateToCloset,
}) => {
  const [selectedBoxId, setSelectedBoxId] = useState<string>('box-coat');
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [onlyBudgetDupes, setOnlyBudgetDupes] = useState<boolean>(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const selectedBox = DEMO_STREET_STYLE_BOXES.find(b => b.id === selectedBoxId) || DEMO_STREET_STYLE_BOXES[0];

  const handleSimulateCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImagePreview(url);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1200);
    }
  };

  const handleAddPieceToWardrobe = (box: DetectedBoundingBox) => {
    // Generate a new WardrobeItem with zero-effort auto-categorization
    const bestMatch = box.matches[0];
    const newItem: WardrobeItem = {
      id: `scanned-${box.id}-${Date.now()}`,
      title: box.label,
      brand: bestMatch ? bestMatch.storeName.split(' ')[0] : 'Curated Atelier',
      category: box.category,
      closetLocation: box.suggestedLocation,
      colorName: box.color.split(' ')[0],
      colorHex: box.color.includes('#') ? box.color.slice(box.color.indexOf('#'), box.color.indexOf('#') + 7) : '#2B2B2B',
      fabric: box.material,
      season: box.category === 'coats_jackets' ? 'Autumn' : 'All-Season',
      style: 'Minimalist Luxury',
      image: box.category === 'coats_jackets' 
        ? 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80'
        : box.category === 'tops_knitwear'
        ? 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'
        : box.category === 'pants_trousers'
        ? 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80'
        : box.category === 'bags'
        ? '/src/assets/images/designer_handbag_accessory_1794301813125.jpg'
        : 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      price: bestMatch ? bestMatch.price : 180,
      dateAdded: new Date().toISOString().split('T')[0],
      capsuleIds: ['main'],
      notes: `Auto-segmented from street style photo with ${(box.confidence * 100).toFixed(0)}% AI confidence. Routed to ${box.suggestedLocation.replace('_', ' ')}.`,
      affiliateOffers: box.matches,
    };

    onAddItemToCloset(newItem);
    setAddedItems(prev => ({ ...prev, [box.id]: true }));
  };

  const filteredMatches = onlyBudgetDupes 
    ? selectedBox.matches.filter(m => m.isBudgetAlternative || m.price < 150)
    : selectedBox.matches;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white/80 rounded-2xl p-5 border border-[#E6E2DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Computer Vision Pipeline</span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
              <Scan className="w-3 h-3" />
              <span>Multi-Object SAM 2 Segmentation</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1">Street Style & Social Media Scanner</h2>
          <p className="text-xs text-neutral-500 max-w-2xl mt-0.5">
            Upload or paste any outfit photo from Instagram, Pinterest, or TikTok. The vision model isolates individual garment pieces, extracts fabric silhouettes, and routes them directly to matching retail and dupe stores.
          </p>
        </div>

        {/* Upload Custom Photo Simulation */}
        <div className="flex items-center gap-2.5 shrink-0">
          <label className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-[#F4F1EA] hover:bg-[#EAE5DC] border border-[#DDD8CD] rounded-xl cursor-pointer transition-colors shadow-2xs">
            <UploadCloud className="w-4 h-4 text-neutral-600" />
            <span>Upload Custom Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleSimulateCustomUpload}
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Main 2-Column Split: Image with Interactive Bounding Boxes (Left) vs Extracted Item Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Street Style Visual Segmentation Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE8]">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Segmented Look Canvas
              </h3>
            </div>
            <span className="text-[11px] text-neutral-500">
              {DEMO_STREET_STYLE_BOXES.length} Garments Detected · Tap any piece
            </span>
          </div>

          {/* Interactive Image Frame */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center select-none">
            <img
              src={uploadedImagePreview || STREET_STYLE_IMAGE}
              alt="Street style outfit to segment"
              className="w-full h-auto max-h-[640px] object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Loading Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                <span className="text-xs font-semibold text-neutral-800 tracking-wide">
                  Extracting Object Boundaries & Color Vectors...
                </span>
              </div>
            )}

            {/* Interactive Bounding Boxes Overlay */}
            {!isAnalyzing && DEMO_STREET_STYLE_BOXES.map((box) => {
              const isSelected = selectedBoxId === box.id;
              const isHovered = hoveredBoxId === box.id;
              const isAdded = !!addedItems[box.id];

              return (
                <div
                  key={box.id}
                  style={{
                    top: `${box.box.top}%`,
                    left: `${box.box.left}%`,
                    width: `${box.box.width}%`,
                    height: `${box.box.height}%`,
                  }}
                  onClick={() => setSelectedBoxId(box.id)}
                  onMouseEnter={() => setHoveredBoxId(box.id)}
                  onMouseLeave={() => setHoveredBoxId(null)}
                  className={`absolute cursor-pointer transition-all duration-200 rounded-lg group ${
                    isSelected
                      ? 'border-2 border-white shadow-xl ring-2 ring-[#1A1A1A] bg-[#1A1A1A]/10'
                      : isHovered
                      ? 'border-2 border-white/90 bg-white/10 ring-1 ring-amber-500 shadow-md'
                      : 'border border-white/60 bg-black/5 hover:border-white'
                  }`}
                >
                  {/* Floating Tag Header */}
                  <div
                    className={`absolute -top-3 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide transition-all shadow-sm flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white ring-1 ring-white/50'
                        : 'bg-white/90 text-neutral-800 backdrop-blur-xs'
                    }`}
                  >
                    <span>{box.label}</span>
                    {isAdded && <Check className="w-3 h-3 text-emerald-400" />}
                  </div>

                  {/* Corner Reticles for High-Tech Optical Precision */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                </div>
              );
            })}
          </div>

          {/* Detected Objects Quick Switcher Strip */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DEMO_STREET_STYLE_BOXES.map((box) => (
              <button
                key={box.id}
                onClick={() => setSelectedBoxId(box.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedBoxId === box.id
                    ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                    : 'bg-[#F4F1EA] text-neutral-700 hover:bg-[#EAE5DC]'
                }`}
              >
                <span>{box.label}</span>
                {addedItems[box.id] && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Piece Breakdown, Auto-Categorization & Retail Matches */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Piece Attribute Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  Visual Segmentation Target
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mt-0.5">
                  {selectedBox.label}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/50">
                  {(selectedBox.confidence * 100).toFixed(0)}% AI Match
                </span>
              </div>
            </div>

            {/* Extracted Physical Attributes */}
            <div className="p-4 bg-[#F8F7F4] rounded-2xl border border-[#EAE6DF] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Detected Color</span>
                <div className="flex items-center gap-1.5">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-black/20" 
                    style={{ backgroundColor: selectedBox.color.split('(')[1]?.replace(')', '') || '#333' }}
                  />
                  <span className="font-medium text-neutral-800">{selectedBox.color}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Fabric Composition</span>
                <span className="font-medium text-neutral-800">{selectedBox.material}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Estimated Price Range</span>
                <span className="font-mono font-bold text-neutral-900">{selectedBox.detectedPriceEst}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Auto-Routing Destination</span>
                <span className="font-semibold text-neutral-900 capitalize">
                  {selectedBox.suggestedLocation.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Zero-Effort Add to Wardrobe Button */}
            <button
              onClick={() => handleAddPieceToWardrobe(selectedBox)}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                addedItems[selectedBox.id]
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1A1A1A] text-white hover:bg-neutral-800 active:scale-[0.98]'
              }`}
            >
              {addedItems[selectedBox.id] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Filed to {selectedBox.suggestedLocation.replace('_', ' ')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Zero-Effort File to Digital Wardrobe</span>
                </>
              )}
            </button>

            {addedItems[selectedBox.id] && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-emerald-700 font-medium">Item is now on your interactive rail.</span>
                <button
                  onClick={onNavigateToCloset}
                  className="inline-flex items-center gap-1 text-neutral-900 font-bold hover:underline"
                >
                  <span>View in Closet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Multi-Platform E-Commerce Results & Dupes */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Cross-Platform Retail Search
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Exact and budget alternative links matched via reverse vision search
                </p>
              </div>

              {/* Filter Dupe Toggle */}
              <button
                onClick={() => setOnlyBudgetDupes(prev => !prev)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors flex items-center gap-1 ${
                  onlyBudgetDupes
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-neutral-100 text-neutral-600 border-transparent hover:border-neutral-300'
                }`}
              >
                <DollarSign className="w-3 h-3" />
                <span>Dupes Only</span>
              </button>
            </div>

            {/* List of Store Matches */}
            <div className="space-y-2.5">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className={`p-3 rounded-xl border transition-all ${
                    match.isBudgetAlternative
                      ? 'bg-emerald-50/30 border-emerald-200/80 hover:border-emerald-300'
                      : 'bg-white border-[#E6E2DC] hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-900">{match.storeName}</span>
                        {match.isBudgetAlternative && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                            Budget Dupe
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        {match.matchScore}% Silhouette Similarity
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-neutral-900">
                        ${match.price}
                      </span>
                      {match.originalPrice && (
                        <span className="block text-[10px] text-neutral-400 line-through font-mono">
                          ${match.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-700 font-medium">In Stock · Ready to Ship</span>
                    <a
                      href={match.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-900 hover:underline"
                    >
                      <span>Buy at {match.storeName.split(' ')[0]}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
