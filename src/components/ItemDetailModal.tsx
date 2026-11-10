import React, { useState } from 'react';
import { WardrobeItem, ClosetLocation } from '../types/wardrobe';
import { X, Sparkles, ExternalLink, ArrowRightLeft, TrendingDown, Tag, Layers, Check } from 'lucide-react';

interface ItemDetailModalProps {
  item: WardrobeItem | null;
  onClose: () => void;
  onMoveLocation?: (itemId: string, newLocation: ClosetLocation) => void;
  onOpenTryOn?: (item: WardrobeItem) => void;
  onAskStylist?: (item: WardrobeItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onMoveLocation,
  onOpenTryOn,
  onAskStylist,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<ClosetLocation>(item?.closetLocation || 'clothes_rail');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!item) return null;

  const locationLabels: Record<ClosetLocation, string> = {
    top_shelf: 'Top Accessory Shelf',
    clothes_rail: 'Smart Clothes Rail',
    drawer_pants: 'Pants & Trousers Drawer',
    drawer_bags: 'Designer Bags Drawer',
    drawer_shoes: 'Shoes & Footwear Drawer',
  };

  const handleLocationChange = (loc: ClosetLocation) => {
    setSelectedLocation(loc);
    if (onMoveLocation) {
      onMoveLocation(item.id, loc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#F8F7F4] border border-[#E6E2DC] shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2DC] bg-white/70">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">{item.brand}</span>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image card with sticker effect */}
            <div className="relative bg-gradient-to-b from-[#EFECE6] to-[#E5E1D8] rounded-xl p-4 flex flex-col items-center justify-center border border-[#E6E2DC] min-h-[280px]">
              {item.priceDropPercent && (
                <div className="absolute top-3 left-3 bg-[#10B981] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{item.priceDropPercent}% OFF</span>
                </div>
              )}
              <img 
                src={item.image} 
                alt={item.title} 
                className="max-h-[240px] w-auto object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 flex items-center gap-2">
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-black/20" 
                  style={{ backgroundColor: item.colorHex }} 
                />
                <span className="text-xs text-neutral-600 font-medium">{item.colorName}</span>
                <span className="text-neutral-300">·</span>
                <span className="text-xs text-neutral-500">{item.fabric}</span>
              </div>
            </div>

            {/* Quick stats & action column */}
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-[#E6E2DC]">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-neutral-500 font-medium">Estimated Value / Retail</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#1A1A1A]">${item.price}</span>
                    {item.originalPrice && (
                      <span className="ml-2 text-sm text-neutral-400 line-through font-mono">${item.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EDE8] text-xs">
                  <div>
                    <span className="text-neutral-400 block">Season</span>
                    <span className="font-medium text-neutral-800">{item.season}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Style</span>
                    <span className="font-medium text-neutral-800">{item.style}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Current Location</span>
                    <span className="font-medium text-neutral-800">{locationLabels[item.closetLocation]}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Date Archived</span>
                    <span className="font-mono text-neutral-600">{item.dateAdded}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {onOpenTryOn && (
                  <button
                    onClick={() => {
                      onOpenTryOn(item);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Try On in Virtual Changing Room</span>
                  </button>
                )}

                {onAskStylist && (
                  <button
                    onClick={() => {
                      onAskStylist(item);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E6E2DC] text-[#1A1A1A] text-xs font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-neutral-500" />
                    <span>Ask AI Stylist: "What matches this?"</span>
                  </button>
                )}
              </div>

              {/* Move Location Selector */}
              <div className="p-3 bg-neutral-100/60 rounded-xl border border-[#E6E2DC]">
                <label className="text-[11px] font-medium text-neutral-500 flex items-center gap-1.5 mb-2">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Reorganize to Closet Section</span>
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value as ClosetLocation)}
                  className="w-full text-xs bg-white border border-[#E6E2DC] rounded-lg px-3 py-2 text-neutral-800 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="clothes_rail">Smart Clothes Rail (Hanging)</option>
                  <option value="top_shelf">Top Accessory Shelf</option>
                  <option value="drawer_pants">Pants & Trousers Drawer</option>
                  <option value="drawer_bags">Designer Bags Drawer</option>
                  <option value="drawer_shoes">Shoes & Footwear Drawer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Affiliate Stores & Dupe Alternatives */}
          {item.affiliateOffers && item.affiliateOffers.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#E6E2DC]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-neutral-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Live Retail Pricing & High-Street Alternatives
                  </h4>
                </div>
                <span className="text-[11px] text-neutral-500">Auto-scraped via Affiliate Bridge</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.affiliateOffers.map((offer) => (
                  <div 
                    key={offer.id} 
                    className={`p-3 rounded-lg border transition-all ${
                      offer.isBudgetAlternative 
                        ? 'bg-emerald-50/40 border-emerald-200/70 hover:border-emerald-300' 
                        : 'bg-white border-[#E6E2DC] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900">{offer.storeName}</span>
                          {offer.isBudgetAlternative && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                              Dupe
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500">{offer.matchScore}% Visual Similarity</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-neutral-900">${offer.price}</span>
                        {offer.originalPrice && (
                          <span className="block text-[10px] text-neutral-400 line-through font-mono">
                            ${offer.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-black/5">
                      <span className={`text-[10px] ${offer.inStock ? 'text-emerald-700 font-medium' : 'text-neutral-400'}`}>
                        {offer.inStock ? 'In Stock' : 'Low Stock'}
                      </span>
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-900 hover:underline"
                      >
                        <span>View Deal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Notes */}
          {item.notes && (
            <div className="p-3.5 bg-white/60 rounded-xl border border-[#E6E2DC] text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900 block mb-1">Wardrobe Curator Notes:</span>
              <p className="italic">{item.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
