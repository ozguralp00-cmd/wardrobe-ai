export type ItemCategory = 
  | 'coats_jackets' 
  | 'tops_knitwear' 
  | 'pants_trousers' 
  | 'shoes' 
  | 'bags' 
  | 'accessories';

export type ClosetLocation = 'top_shelf' | 'clothes_rail' | 'drawer_shoes' | 'drawer_bags' | 'drawer_pants';

export interface StoreOffer {
  id: string;
  storeName: string;
  storeLogo?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  inStock: boolean;
  isBudgetAlternative?: boolean;
  matchScore: number; // 0 - 100
  url: string;
}

export interface WardrobeItem {
  id: string;
  title: string;
  brand: string;
  category: ItemCategory;
  closetLocation: ClosetLocation;
  colorName: string;
  colorHex: string;
  fabric: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';
  style: 'Casual' | 'Minimalist Luxury' | 'Streetwear' | 'Formal' | 'Smart Casual';
  image: string;
  price: number;
  originalPrice?: number;
  priceDropPercent?: number;
  dateAdded: string;
  capsuleIds: string[];
  notes?: string;
  affiliateOffers?: StoreOffer[];
  priceHistory?: { date: string; price: number }[];
}

export interface CapsuleWardrobe {
  id: string;
  name: string;
  itemCount: number;
  description: string;
  season: string;
}

export interface DetectedBoundingBox {
  id: string;
  label: string;
  category: ItemCategory;
  box: { top: number; left: number; width: number; height: number }; // percentages
  confidence: number;
  color: string;
  material: string;
  suggestedLocation: ClosetLocation;
  detectedPriceEst: string;
  matches: StoreOffer[];
}

export interface StylistOutfitSuggestion {
  id: string;
  title: string;
  occasion: string;
  score: number;
  items: WardrobeItem[];
  missingPiece?: {
    title: string;
    category: ItemCategory;
    reason: string;
    offer: StoreOffer;
  };
  stylingTip: string;
  colorHarmony: string[];
}
