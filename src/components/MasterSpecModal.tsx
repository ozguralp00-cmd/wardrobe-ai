import React, { useState } from 'react';
import { X, Copy, Check, Download, Layers, Cpu, Compass, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

interface MasterSpecModalProps {
  onClose: () => void;
}

export const MasterSpecModal: React.FC<MasterSpecModalProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'all' | 'journey' | 'tech' | 'features'>('all');
  const [copied, setCopied] = useState(false);

  const fullSpecText = `
# Master Product Specification & System Architecture Blueprint
## Application: Atelier — Digital Wardrobe & Smart Fashion Assistant

---

### 1. Executive Summary & Value Proposition
- **The Core Problem:** Fashion discovery on visual platforms (Instagram, Pinterest, TikTok) is fragmented. Users capture screenshots or save posts, but linking them to purchase links, affordable dupes, and their existing wardrobe is manual, chaotic, and leads to abandoned carts or closet duplication.
- **The Solution:** A mobile-first lifestyle platform combining **Multi-Object Visual Segmentation**, an **Interactive Digital Walk-In Closet** (with physical swaying rails, accessory shelves, and sliding drawers), **Diffusion-Based Virtual Try-On (VTO)**, and an **Autonomous Price Radar**.

---

### 2. End-to-End User Journey & Interaction Flow

#### Phase 1: Ingestion & Social Media Spotting
1. **Source Discovery:** The user encounters an inspirational outfit on Instagram Reels, TikTok, or takes a photo on the street.
2. **Native OS Share Sheet Trigger:** The user taps the OS "Share" sheet and selects "Atelier: Scan Outfit".
3. **App Reception & Preprocessing:** Atelier accepts the payload (image or video frame URL), resizes it to a normalized $1024 \\times 1024$ canvas, normalizes color space (sRGB), and invokes the Multi-Object Visual Segmentation API.

#### Phase 2: Segmentation, Reverse Search & Categorization
4. **Visual Segmentation:** The computer vision model (Segment Anything SAM 2 + YOLOv10) generates polygonal mask boundaries and bounding boxes for each detected item (e.g., tailored coat, turtleneck, wide-leg trousers, bag, sneakers).
5. **Interactive Confirmation:** The user sees the outfit with interactive bounding boxes. Tapping any piece opens the **Item Attribute Card**:
   - Estimated fabric, silhouette cut, exact hex palette.
   - Vector similarity search results querying Farfetch, SSENSE, Zara, Trendyol, and local boutiques.
   - Budget-friendly "Dupe Alternatives" filter.
6. **Zero-Effort Auto-Filing:** The user taps "Add to Closet". The item is categorized and routed without manual sorting:
   - Outerwear & Knits $\\rightarrow$ Smart Clothes Rail (hangers sway with physics).
   - Hats, Sunglasses, Watches, Belts $\\rightarrow$ Top Accessory Shelf.
   - Shoes, Handbags, Pants $\\rightarrow$ Designated Interactive Pull-Drawers.

#### Phase 3: Wardrobe Exploration, Try-On & Outfit Generation
7. **Virtual Walk-In Closet Interaction:** The user browses their physical rail with realistic haptic-like inertia. Items with active discounts pulse with an emerald green price-drop badge.
8. **Virtual Try-On Changing Room:** The user selects 1 to 3 items and launches the VTO Changing Room. The neural diffusion pipeline warps the garments over the user's avatar, rendering realistic fabric drape tension, body contouring, and ambient lighting shadows.
9. **AI Stylist Consultation:** The user asks: *"What shoes and pants from my wardrobe match this camel coat?"* The stylist cross-references cuts, textures, and color harmonies, generating complete lookbook cards with missing piece recommendations.
10. **Autonomous Price Radar:** In the background, the scrapers monitor item links. When a price drops by $\\ge 10\\%$, a push alert notifies the user with direct affiliate checkout links.

---

### 3. Technical Stack Recommendations

#### A. Mobile Frontend Architecture: React Native + Skia + Reanimated 3
- **Primary Recommendation:** **React Native (with Hermes engine)** or **Flutter 3.x**.
- **Rationale for React Native:**
  - **Shared Codebase with Web:** Maximum reuse of TypeScript business logic, types, and affiliate parsing engines.
  - **Shopify React Native Skia & React Native Reanimated 3:** Provides 60–120 FPS hardware-accelerated rendering for the physical swaying clothing rail, inertia scrolling, and drawer gestures.
  - **Camera & Share Extensions:** Seamless native iOS Share Sheet and Android Send Intent integration via \`react-native-share\`.
  - **Haptic Engine:** \`react-native-haptic-feedback\` providing subtle physical clicks as hangers slide along the rail.

#### B. Backend Infrastructure & Microservices
- **API Gateway:** Go (Fiber/Gin) or Node.js (Fastify) for sub-15ms request routing.
- **AI & Computer Vision Core:** Python FastAPI running asynchronously on Google Cloud Run with GPU accelerators (NVIDIA L4 / A10G).
- **Persistent Storage:**
  - **PostgreSQL (Cloud SQL):** Relational tables for user profiles, capsules, wardrobe items, and purchase receipts.
  - **Qdrant or Milvus (Vector Database):** Stores 768-dimensional fashion embeddings (CLIP / DINOv2) for sub-50ms reverse image search across retail catalogs.
  - **Redis Cache:** Session storage, price watch queue, and rate limiting.

#### C. Computer Vision & AI Models
- **Object Detection & Localization:**
  - **YOLOv10 / Grounding DINO:** High-speed bounding box proposals for 20+ fashion categories.
  - **Segment Anything 2 (SAM 2):** Pixel-perfect polygonal garment masks and sticker-effect alpha cutout generation.
- **Feature Extraction & Image Embeddings:**
  - **FashionCLIP / DINOv2 (ViT-B/14):** Dense visual representation encoding color, pattern, lapel structure, and silhouette.
- **Virtual Try-On (VTO) Pipeline:**
  - **OOTDiffusion / CatVTON (Diffusion-based Virtual Try-On):** Conditioned Latent Diffusion models generating high-fidelity garment warping over human body joints without 3D mesh overhead.
  - **DensePose:** Estimates human body surface UV maps for accurate fabric tension simulation.
- **Conversational Stylist:**
  - **Gemini 3.8 Flash:** Low-latency conversational reasoning over user wardrobe JSON graphs, climate data, and color wheel harmonies.

#### D. E-Commerce Scraping & Affiliate Integration Strategy
- **Official Affiliate APIs:**
  - **Rakuten Marketing & Impact.com:** Enterprise affiliate links for luxury merchants (Farfetch, SSENSE, MatchesFashion, Net-a-Porter).
  - **Klarna / PriceRunner Open Product API:** Standardized price history feeds and stock statuses.
- **Resilient Background Scraping Pipeline:**
  - **Zyte / BrightData Web Unlocker Proxies:** Automated headless browser workers for platforms lacking public APIs (Zara, Trendyol, H&M).
  - **Cron Worker Queue (Celery / BullMQ):** Runs every 30 minutes, checking cached product URLs for price alterations and DOM stock tags (\`data-stock-status\`).

---

### 4. Core Feature Functional Specifications

#### Feature 1: Multi-Object Visual Segmentation Engine
- **Input:** Single RGB image (HEIC, JPEG, PNG) up to 20MB.
- **Pipeline Latency:** $\\le 1.2$ seconds on GPU.
- **Functional Requirements:**
  - Detect and isolate multiple simultaneous garments: Outerwear, Tops, Bottoms, Footwear, Bags, Jewelry, Hats, Eyewear.
  - Return polygonal SVG/PNG alpha cutout mask with background removal.
  - Extract dominant Pantone color codes and fabric textures (leather, wool, silk, denim, linen).
  - Query Vector DB to retrieve top 5 matching retail products and budget dupes ($<\\$100$).

#### Feature 2: Virtual Walk-in Closet Organization Module
- **Top Shelf:** Horizontal scrolling accessory carousel.
- **Smart Clothes Rail:** Continuous physics rail with spring physics (\`damping: 15, stiffness: 90\`). Dragging or flicking induces angular tilt ($3^{\\circ}$) on adjacent hangers.
- **Slide-up Drawers:** 3-state bottom drawers (Closed, Peek, Expanded Grid) with smooth spring transitions.
- **Auto-Categorization Rules:** Rule engine mapping AI classification directly to physical closet slots without manual user input.

#### Feature 3: Virtual Try-On (VTO) Changing Room
- **Body Avatar Support:** Preset mannequins (diverse sizing XS–XXL) or custom user full-body photograph.
- **Multi-Layer Stacking:** Z-index aware layering: Skin $\\rightarrow$ Inner Knit $\\rightarrow$ Trousers $\\rightarrow$ Outer Coat $\\rightarrow$ Accessories.
- **Simulation Parameters:** Fabric drape toggle, ambient lighting temperature slider (2800K–5500K), and fit tension metrics.
`;

  const handleCopySpec = () => {
    navigator.clipboard.writeText(fullSpecText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([fullSpecText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Atelier_Digital_Wardrobe_Master_Specification.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#F8F7F4] border border-[#E6E2DC] shadow-2xl rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E2DC] bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                Master Product Specification & Implementation Blueprint
              </span>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Atelier: Digital Wardrobe & Smart Fashion Assistant
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySpec}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1A1A1A] hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors ml-2 cursor-pointer"
              aria-label="Close specification modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="px-6 py-2.5 bg-[#F0EDE8] border-b border-[#E6E2DC] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSection === 'all' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveSection('journey')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSection === 'journey' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            1. User Journey & Flow
          </button>
          <button
            onClick={() => setActiveSection('tech')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSection === 'tech' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            2. Technical Stack & AI Models
          </button>
          <button
            onClick={() => setActiveSection('features')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSection === 'features' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            3. Core Feature Specification
          </button>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-neutral-800 text-sm leading-relaxed font-sans">
          {/* SECTION 1: USER JOURNEY & FLOW */}
          {(activeSection === 'all' || activeSection === 'journey') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  1. End-to-End User Journey & Interaction Flow
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#E6E2DC] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wide">
                    Spot & Share Sheet Import
                  </h4>
                  <p className="text-xs text-neutral-600 leading-normal">
                    User spots an outfit on Instagram, TikTok, or takes a photo. Using the native OS Share Sheet, they share directly to <strong>Atelier</strong> without leaving the visual app.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E6E2DC] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wide">
                    Multi-Object Vision Split
                  </h4>
                  <p className="text-xs text-neutral-600 leading-normal">
                    AI computer vision separates every individual garment piece (coat, sweater, pants, bag, shoes). Interactive bounding boxes allow 1-click inspection of silhouettes, colors, and dupe retail prices.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E6E2DC] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wide">
                    Zero-Effort Wardrobe Filing
                  </h4>
                  <p className="text-xs text-neutral-600 leading-normal">
                    Auto-categorization routes items to the wooden/brass clothes rail, accessory top shelf, or bottom drawers. Items gently sway with physical haptics and receive real-time price monitoring.
                  </p>
                </div>
              </div>

              {/* Detailed Flowchart Steps */}
              <div className="p-5 bg-white rounded-2xl border border-[#E6E2DC] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  Detailed Step-by-Step Walkthrough
                </h4>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-neutral-700">
                  <li><strong>Image Capture / Ingestion:</strong> Normalizes resolution to $1024 \times 1024$, applies EXIF orientation correction, and executes background noise reduction.</li>
                  <li><strong>Parallel Inference:</strong> YOLOv10 produces class tags and bounding boxes; SAM 2 extracts transparent PNG sticker cutouts; FashionCLIP computes visual embedding vectors.</li>
                  <li><strong>Affiliate Reverse Indexing:</strong> Embeddings match against Farfetch, SSENSE, Zara, H&M, and Trendyol inventories within 350ms using cosine vector distance.</li>
                  <li><strong>Physical Rail Placement:</strong> Item auto-populates the virtual walk-in closet with physics-based hanger attachment and background removal.</li>
                  <li><strong>Virtual Try-On:</strong> User can project any item or ensemble directly onto their digital avatar or personal photograph.</li>
                  <li><strong>Autonomous Radar:</strong> Daily cron worker monitors stock and price movements; triggers push notification upon $\ge 10\%$ discount.</li>
                </ol>
              </div>
            </section>
          )}

          {/* SECTION 2: TECHNICAL STACK RECOMMENDATIONS */}
          {(activeSection === 'all' || activeSection === 'tech') && (
            <section className="space-y-4 pt-4 border-t border-[#E6E2DC]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  2. Technical Stack Recommendations & AI Models
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Client */}
                <div className="p-5 bg-white rounded-2xl border border-[#E6E2DC] space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center justify-between">
                    <span>Mobile Frontend Framework</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      React Native + Skia
                    </span>
                  </h4>
                  <ul className="text-xs space-y-2 text-neutral-600">
                    <li><strong>React Native (Hermes Engine):</strong> Native iOS/Android performance with shared TypeScript business logic.</li>
                    <li><strong>Shopify React Native Skia & Reanimated 3:</strong> 60–120 FPS hardware-accelerated physics for the swaying clothes rail, inertia drags, and drawer slide gestures.</li>
                    <li><strong>Native Haptics:</strong> \`react-native-haptic-feedback\` mimicking physical metal rail friction and hanger clicks.</li>
                    <li><strong>Image Caching:</strong> \`react-native-fast-image\` with progressive WebP streaming.</li>
                  </ul>
                </div>

                {/* Backend & AI */}
                <div className="p-5 bg-white rounded-2xl border border-[#E6E2DC] space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center justify-between">
                    <span>AI & Computer Vision Core</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      FastAPI + SAM 2 + VTO
                    </span>
                  </h4>
                  <ul className="text-xs space-y-2 text-neutral-600">
                    <li><strong>Segmentation:</strong> Meta's Segment Anything SAM 2 coupled with YOLOv10 for zero-shot garment boundary delineation.</li>
                    <li><strong>Vector Search:</strong> Qdrant or Milvus Vector Database storing 768-d FashionCLIP / DINOv2 embeddings for instant dupe retrieval.</li>
                    <li><strong>Virtual Try-On (VTO):</strong> Latent Diffusion pipeline (CatVTON / OOTDiffusion) with DensePose body UV warping.</li>
                    <li><strong>Conversational Stylist:</strong> Gemini 3.8 Flash for multi-turn outfit synthesis and color wheel harmony matching.</li>
                  </ul>
                </div>
              </div>

              {/* Data Pipeline & Scraping */}
              <div className="p-5 bg-white rounded-2xl border border-[#E6E2DC] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  Affiliate API & Scraping Ingestion Architecture
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E6E2DC]">
                    <span className="font-bold text-neutral-900 block mb-1">1. Tier 1: Official APIs</span>
                    <span className="text-neutral-600">Rakuten Advertising, Impact.com, and Klarna Product Feeds for luxury merchants.</span>
                  </div>
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E6E2DC]">
                    <span className="font-bold text-neutral-900 block mb-1">2. Tier 2: Resilient Proxies</span>
                    <span className="text-neutral-600">Zyte Web Unlocker / BrightData rotating headless crawlers for Zara, Trendyol, and H&M.</span>
                  </div>
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#E6E2DC]">
                    <span className="font-bold text-neutral-900 block mb-1">3. Worker Queue</span>
                    <span className="text-neutral-600">Celery + Redis distributed queue checking 10,000+ SKU price points every 30 minutes.</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: CORE FEATURE SPECIFICATION */}
          {(activeSection === 'all' || activeSection === 'features') && (
            <section className="space-y-4 pt-4 border-t border-[#E6E2DC]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  3. Core Feature Functional Specifications
                </h3>
              </div>

              <div className="space-y-4">
                {/* Module A */}
                <div className="p-5 bg-white rounded-2xl border border-[#E6E2DC] space-y-2">
                  <h4 className="font-bold text-sm text-neutral-900">
                    A. Multi-Object Visual Segmentation Engine
                  </h4>
                  <p className="text-xs text-neutral-600">
                    <strong>Objective:</strong> Automatically isolate up to 8 distinct apparel items in a single street-style photo, generating transparent sticker assets and matching commercial products.
                  </p>
                  <div className="text-xs text-neutral-700 pt-1 space-y-1">
                    <p>• <strong>Accuracy Benchmark:</strong> $\ge 94\%$ mAP across outerwear, tops, bottoms, footwear, bags, and headwear.</p>
                    <p>• <strong>Processing Latency:</strong> $\le 1.2$ seconds end-to-end on server-side GPU.</p>
                    <p>• <strong>Attribute Extraction:</strong> Hex color code, fabric composition estimate, silhouette cut (e.g. relaxed, double-breasted, wide-leg), and season tag.</p>
                  </div>
                </div>

                {/* Module B */}
                <div className="p-5 bg-white rounded-2xl border border-[#E6E2DC] space-y-2">
                  <h4 className="font-bold text-sm text-neutral-900">
                    B. Interactive Digital Walk-in Closet (The Physical Wardrobe UI)
                  </h4>
                  <p className="text-xs text-neutral-600">
                    <strong>Objective:</strong> Replace sterile e-commerce grid lists with a tactile, luxury boutique walk-in closet environment.
                  </p>
                  <div className="text-xs text-neutral-700 pt-1 space-y-1">
                    <p>• <strong>Top Accessory Shelf:</strong> Horizontal inertia carousel for eyewear, watches, jewelry, and hats.</p>
                    <p>• <strong>Smart Clothes Rail:</strong> Brushed brass rail with physics-simulated wooden hangers that sway when dragged or flicked.</p>
                    <p>• <strong>Interactive Bottom Drawers:</strong> 3 slide-up velvet/travertine lined compartments for Footwear, Handbags, and Trousers.</p>
                    <p>• <strong>Zero-Effort Auto-Routing:</strong> Vision classifier routes scanned items directly to appropriate closet slots without user sorting.</p>
                  </div>
                </div>

                {/* Module C */}
                <div className="p-5 bg-white rounded-2xl border border-[#E6E2DC] space-y-2">
                  <h4 className="font-bold text-sm text-neutral-900">
                    C. Diffusion-Based Virtual Try-On (VTO) Changing Room
                  </h4>
                  <p className="text-xs text-neutral-600">
                    <strong>Objective:</strong> Enable users to realistically see how garments from their closet or retail search drape on their body.
                  </p>
                  <div className="text-xs text-neutral-700 pt-1 space-y-1">
                    <p>• <strong>Multi-Garment Layering:</strong> Supports inner shirt + outer coat + trousers simultaneously.</p>
                    <p>• <strong>Drape & Lighting Matching:</strong> Re-renders shadows, lapel fold tension, and matches studio ambient lighting.</p>
                    <p>• <strong>Fit Assessment:</strong> Provides dimensional feedback on shoulder span, chest breathability, and hem length.</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/90 border-t border-[#E6E2DC] flex items-center justify-between text-xs text-neutral-500">
          <span>Atelier Systems Architecture · Confidential Master Specification v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1A1A1A] text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
