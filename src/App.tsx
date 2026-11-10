import React, { useState } from 'react';
import { TopBar, ActiveTab } from './components/TopBar';
import { ClosetView } from './components/ClosetView';
import { VisualScanner } from './components/VisualScanner';
import { VirtualTryOn } from './components/VirtualTryOn';
import { AIStylist } from './components/AIStylist';
import { PriceTrackerModal } from './components/PriceTrackerModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { MasterSpecModal } from './components/MasterSpecModal';
import { INITIAL_WARDROBE, INITIAL_CAPSULES } from './data/mockWardrobe';
import { WardrobeItem, ClosetLocation, CapsuleWardrobe } from './types/wardrobe';

export default function App() {
  const [items, setItems] = useState<WardrobeItem[]>(INITIAL_WARDROBE);
  const [capsules, setCapsules] = useState<CapsuleWardrobe[]>(INITIAL_CAPSULES);
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string>('main');
  const [activeTab, setActiveTab] = useState<ActiveTab>('closet');

  // Modals & Contextual Selection
  const [selectedItemForModal, setSelectedItemForModal] = useState<WardrobeItem | null>(null);
  const [preselectedItemForTryOn, setPreselectedItemForTryOn] = useState<WardrobeItem | null>(null);
  const [preselectedItemForStylist, setPreselectedItemForStylist] = useState<WardrobeItem | null>(null);
  const [showBlueprintModal, setShowBlueprintModal] = useState<boolean>(false);

  const currentCapsule = capsules.find(c => c.id === selectedCapsuleId) || capsules[0];
  const priceDropCount = items.filter(i => i.priceDropPercent && i.priceDropPercent > 0).length;

  const handleAddItemToCloset = (newItem: WardrobeItem) => {
    setItems(prev => [newItem, ...prev]);
    // update current capsule count
    setCapsules(prev => prev.map(c => {
      if (c.id === selectedCapsuleId || c.id === 'main') {
        return { ...c, itemCount: c.itemCount + 1 };
      }
      return c;
    }));
  };

  const handleMoveLocation = (itemId: string, newLocation: ClosetLocation) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, closetLocation: newLocation };
      }
      return item;
    }));
  };

  const handleOpenTryOnWithItem = (item: WardrobeItem) => {
    setPreselectedItemForTryOn(item);
    setActiveTab('tryon');
  };

  const handleOpenStylistWithItem = (item: WardrobeItem) => {
    setPreselectedItemForStylist(item);
    setActiveTab('stylist');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-[#F8F7F4]">
      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        capsules={capsules}
        selectedCapsuleId={selectedCapsuleId}
        onSelectCapsule={setSelectedCapsuleId}
        onOpenImport={() => setActiveTab('scanner')}
        onOpenBlueprint={() => setShowBlueprintModal(true)}
        priceDropCount={priceDropCount}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'closet' && (
          <ClosetView
            items={items}
            currentCapsule={currentCapsule}
            onSelectItem={(item) => setSelectedItemForModal(item)}
            onOpenImport={() => setActiveTab('scanner')}
            onOpenTryOn={handleOpenTryOnWithItem}
            onOpenStylist={() => setActiveTab('stylist')}
          />
        )}

        {activeTab === 'scanner' && (
          <VisualScanner
            onAddItemToCloset={handleAddItemToCloset}
            onNavigateToCloset={() => setActiveTab('closet')}
          />
        )}

        {activeTab === 'tryon' && (
          <VirtualTryOn
            closetItems={items}
            preselectedItem={preselectedItemForTryOn}
            onOpenItemDetail={(item) => setSelectedItemForModal(item)}
          />
        )}

        {activeTab === 'stylist' && (
          <AIStylist
            wardrobe={items}
            preselectedItem={preselectedItemForStylist}
            onSelectItem={(item) => setSelectedItemForModal(item)}
            onOpenTryOn={handleOpenTryOnWithItem}
          />
        )}

        {activeTab === 'price_watch' && (
          <PriceTrackerModal
            items={items}
            onSelectItem={(item) => setSelectedItemForModal(item)}
          />
        )}
      </main>

      {/* Item Detail & Store Comparison Modal */}
      {selectedItemForModal && (
        <ItemDetailModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onMoveLocation={handleMoveLocation}
          onOpenTryOn={handleOpenTryOnWithItem}
          onAskStylist={handleOpenStylistWithItem}
        />
      )}

      {/* Master Product Specification & System Architecture Blueprint Modal */}
      {showBlueprintModal && (
        <MasterSpecModal onClose={() => setShowBlueprintModal(false)} />
      )}

      {/* Quiet Minimalist Boutique Footer */}
      <footer className="border-t border-[#E6E2DC] bg-[#F4F1EA] py-6 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-neutral-800 tracking-tight">ATELIER</span>
            <span>·</span>
            <span>Digital Wardrobe & Smart Fashion Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => setShowBlueprintModal(true)}
              className="text-neutral-700 hover:text-black font-medium underline underline-offset-2 cursor-pointer"
            >
              View System Architecture & Master Specs
            </button>
            <span className="text-neutral-300">·</span>
            <span>Zero-Effort Neural Vision</span>
            <span className="text-neutral-300">·</span>
            <span>Affiliate Bridge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
