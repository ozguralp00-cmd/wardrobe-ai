import React, { useState } from 'react';
import { WardrobeItem } from '../types/wardrobe';
import { 
  TrendingDown, 
  Bell, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  DollarSign, 
  Clock, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface PriceTrackerModalProps {
  items: WardrobeItem[];
  onSelectItem: (item: WardrobeItem) => void;
}

export const PriceTrackerModal: React.FC<PriceTrackerModalProps> = ({
  items,
  onSelectItem,
}) => {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [targetPrices, setTargetPrices] = useState<Record<string, number>>({});

  // Items with price drops or monitored offers
  const trackedItems = items.filter(i => (i.affiliateOffers && i.affiliateOffers.length > 0) || i.priceDropPercent);

  const triggerSimulatedPushNotification = (item: WardrobeItem) => {
    setActiveAlert(
      `🔔 Atelier Price Drop: The ${item.brand} ${item.title} on your clothes rail is now ${item.priceDropPercent || 25}% off ($${item.price})!`
    );
    setTimeout(() => {
      setActiveAlert(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Push Notification Simulation Toast */}
      {activeAlert && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-[#1A1A1A] text-white p-4 rounded-2xl shadow-2xl border border-neutral-700 animate-in slide-in-from-top-4 flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold block text-emerald-400 mb-0.5">Mobile Push Notification</span>
            <p className="text-neutral-200">{activeAlert}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white/80 rounded-2xl p-5 border border-[#E6E2DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
              Retail Intelligence Engine
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              <span>Real-Time E-Commerce Scraping & Price Drops</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1">Smart Price & Stock Tracker</h2>
          <p className="text-xs text-neutral-500 max-w-2xl mt-0.5">
            Atelier monitors saved and hanging wardrobe pieces across 40+ global luxury and high-street retailers (Farfetch, SSENSE, Zara, Trendyol). Receive alerts when pieces drop in price or inventory dwindles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-600 font-medium">Scraped Frequency: Every 15m</span>
        </div>
      </div>

      {/* Tracked Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trackedItems.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header with Price Drop Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      {item.brand}
                    </span>
                    <h3 className="font-serif text-base font-bold text-neutral-900 truncate max-w-[200px]">
                      {item.title}
                    </h3>
                  </div>

                  {item.priceDropPercent ? (
                    <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>-{item.priceDropPercent}%</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      Watching
                    </span>
                  )}
                </div>

                {/* Product Imagery */}
                <div 
                  onClick={() => onSelectItem(item)}
                  className="relative h-36 w-full flex items-center justify-center bg-[#F8F7F4] rounded-2xl p-3 my-3 cursor-pointer group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-32 w-auto object-contain group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] text-neutral-500 bg-white/90 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Filed on {item.closetLocation.replace('_', ' ')}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-xl font-bold font-mono text-neutral-900">${item.price}</span>
                    {item.originalPrice && (
                      <span className="ml-2 text-xs text-neutral-400 line-through font-mono">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                  {item.priceDropPercent && (
                    <span className="text-xs font-semibold text-emerald-700">
                      Save ${(item.originalPrice || 0) - item.price}
                    </span>
                  )}
                </div>

                {/* Live Stock & Store Availability */}
                {item.affiliateOffers && item.affiliateOffers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F0EDE8] space-y-1.5 text-xs">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                      Best Store Matches:
                    </span>
                    {item.affiliateOffers.slice(0, 2).map((off) => (
                      <div key={off.id} className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-neutral-800">{off.storeName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">${off.price}</span>
                          <a
                            href={off.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-500 hover:text-black"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2 border-t border-[#F0EDE8]">
                <button
                  onClick={() => triggerSimulatedPushNotification(item)}
                  className="flex-1 py-2 px-3 bg-[#F4F1EA] hover:bg-[#EAE5DC] text-neutral-800 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Simulate Push Alert</span>
                </button>

                <button
                  onClick={() => onSelectItem(item)}
                  className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
