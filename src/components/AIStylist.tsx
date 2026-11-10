import React, { useState } from 'react';
import { WardrobeItem, StylistOutfitSuggestion } from '../types/wardrobe';
import { INITIAL_OUTFIT_SUGGESTIONS } from '../data/mockWardrobe';
import { 
  Sparkles, 
  Send, 
  ArrowRight, 
  ExternalLink, 
  Check, 
  Plus, 
  ShoppingBag,
  Palette,
  Lightbulb
} from 'lucide-react';

interface AIStylistProps {
  wardrobe: WardrobeItem[];
  preselectedItem?: WardrobeItem | null;
  onSelectItem: (item: WardrobeItem) => void;
  onOpenTryOn: (item: WardrobeItem) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  outfit?: StylistOutfitSuggestion;
  timestamp: string;
}

export const AIStylist: React.FC<AIStylistProps> = ({
  wardrobe,
  preselectedItem,
  onSelectItem,
  onOpenTryOn,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'stylist',
      text: "Bonjour! I am your Atelier Personal Stylist. I analyze your digital wardrobe's silhouettes, fabric drape, and color palettes to create cohesive ensembles for any occasion or climate. How may I assist your wardrobe today?",
      timestamp: '10:00 AM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: preselectedItem 
        ? `What shoes and pants from my wardrobe match this ${preselectedItem.title}?`
        : 'What shoes and pants from my wardrobe match this Double-Faced Camel Wool Overcoat?',
      timestamp: '10:01 AM',
    },
    {
      id: 'msg-3',
      sender: 'stylist',
      text: "Based on the architectural drape and warm camel tone of your coat, I recommend pairing it with your High-Waisted Charcoal Pleated Wool Trousers and Minimalist White Leather Sneakers. Here is your curated look:",
      outfit: INITIAL_OUTFIT_SUGGESTIONS[0],
      timestamp: '10:01 AM',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'What shoes & pants match my Camel Coat?',
    'Style an ensemble for a Paris gallery opening in 18°C',
    'Find budget alternatives to complete my monochrome blazer look',
    'Pack a 4-piece minimalist capsule for a weekend trip',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let responseOutfit: StylistOutfitSuggestion | undefined = undefined;
      let replyText = '';

      if (text.toLowerCase().includes('blazer') || text.toLowerCase().includes('monochrome') || text.toLowerCase().includes('budget')) {
        replyText = "Here is a sharp, balanced monochrome power silhouette utilizing your Deconstructed Charcoal Wool Blazer, paired with the Ivory Knit and Prada Loafers. Notice how the contrast lapel elongates your torso:";
        responseOutfit = INITIAL_OUTFIT_SUGGESTIONS[1];
      } else if (text.toLowerCase().includes('gallery') || text.toLowerCase().includes('paris') || text.toLowerCase().includes('camel')) {
        replyText = "For an effortless gallery stroll, we balance the voluminous calf-length camel overcoat with high-waisted fluid trousers and clean white court sneakers:";
        responseOutfit = INITIAL_OUTFIT_SUGGESTIONS[0];
      } else {
        replyText = `I evaluated your ${wardrobe.length} digital wardrobe items across cut, fabric weight, and color theory. Here is a curated styling recommendation:`;
        responseOutfit = INITIAL_OUTFIT_SUGGESTIONS[0];
      }

      const stylistReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'stylist',
        text: replyText,
        outfit: responseOutfit,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, stylistReply]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white/80 rounded-2xl p-5 border border-[#E6E2DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
              Conversational Engine
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Contextual Fashion LLM & Outfit Synthesis</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1">AI Stylist & Outfit Generator</h2>
          <p className="text-xs text-neutral-500 max-w-2xl mt-0.5">
            Ask for styling formulas, weather-appropriate capsule packs, or budget dupe recommendations that seamlessly complement the garments hanging on your rail.
          </p>
        </div>

        {/* Quick Stylist Tips */}
        <div className="flex items-center gap-2 bg-[#F4F1EA] px-3 py-2 rounded-xl border border-[#DDD8CD] text-xs text-neutral-700">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Tip: Ask for specific weather, event, or high/low styling mixes</span>
        </div>
      </div>

      {/* Main Chat & Outfit Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat Conversation Stream */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6E2DC] shadow-md flex flex-col h-[700px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-[#F0EDE8] bg-[#F8F7F4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif text-xs font-bold">
                A
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Atelier Personal Stylist</span>
                <span className="text-[10px] text-neutral-500 font-mono">Fashion Intelligence Active</span>
              </div>
            </div>
            <span className="text-[11px] text-neutral-400">Trained on Runway & Editorial Curations</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#1A1A1A] text-white rounded-br-xs'
                        : 'bg-[#F4F1EA] text-neutral-900 border border-[#E5E0D6] rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 font-mono ${
                        isUser ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Render Embedded Outfit Card inside chat stream if present */}
                  {msg.outfit && (
                    <div className="w-full max-w-[90%] bg-gradient-to-b from-white to-[#F8F7F4] rounded-2xl border border-[#D9D3C7] p-4 shadow-sm space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-[#F0EDE8] pb-2">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-semibold">
                            {msg.outfit.score}% Aesthetic Match
                          </span>
                          <h4 className="font-serif text-sm font-bold text-neutral-900">
                            {msg.outfit.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-neutral-500">{msg.outfit.occasion}</span>
                      </div>

                      {/* Items Grid in the generated look */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {msg.outfit.items.map((it) => (
                          <button
                            key={it.id}
                            onClick={() => onSelectItem(it)}
                            className="bg-white p-2 rounded-xl border border-[#E6E2DC] hover:border-neutral-900 transition-all text-left flex flex-col items-center group cursor-pointer"
                          >
                            <div className="h-12 w-full flex items-center justify-center">
                              <img
                                src={it.image}
                                alt={it.title}
                                className="max-h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[9px] font-semibold text-neutral-900 truncate w-full text-center mt-1">
                              {it.brand}
                            </span>
                            <span className="text-[8px] font-mono text-neutral-500">${it.price}</span>
                          </button>
                        ))}
                      </div>

                      {/* Styling Tip Box */}
                      <p className="text-[11px] text-neutral-600 italic bg-[#F4F1EA] p-2.5 rounded-xl border border-[#E6E2DC]">
                        "{msg.outfit.stylingTip}"
                      </p>

                      {/* Missing Piece Affiliate Recommendation */}
                      {msg.outfit.missingPiece && (
                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3" />
                              <span>Missing Completion Piece</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-neutral-900">
                              ${msg.outfit.missingPiece.offer.price}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-neutral-900">
                            {msg.outfit.missingPiece.title} ({msg.outfit.missingPiece.offer.storeName})
                          </p>
                          <p className="text-[10px] text-neutral-600">
                            {msg.outfit.missingPiece.reason}
                          </p>
                          <a
                            href={msg.outfit.missingPiece.offer.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 hover:underline pt-1"
                          >
                            <span>Shop on {msg.outfit.missingPiece.offer.storeName}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-neutral-400 italic">
                <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce delay-200" />
                <span>Atelier Stylist is analyzing closet textures...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-4 py-2 border-t border-[#F0EDE8] bg-[#F8F7F4] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(promptText)}
                className="px-2.5 py-1 text-[11px] font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-[#E6E2DC] rounded-lg whitespace-nowrap transition-colors cursor-pointer"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-[#F0EDE8] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask for outfit pairings, occasion styling, or budget alternatives..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 text-xs bg-[#F8F7F4] border border-[#E6E2DC] rounded-xl px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim()}
              className="p-2.5 bg-[#1A1A1A] hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Active Lookbook Moodboard & Color Harmonies */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E6E2DC] shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE8]">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-neutral-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Featured Lookbook Moodboard
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                98% Harmony Score
              </span>
            </div>

            {/* Visual Capsule Harmony Swatches */}
            <div>
              <span className="text-[11px] font-medium text-neutral-500 block mb-1.5">
                Chromatic Balance & Undertones
              </span>
              <div className="flex items-center gap-2">
                {INITIAL_OUTFIT_SUGGESTIONS[0].colorHarmony.map((hex, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full h-7 rounded-lg border border-black/10 shadow-xs" 
                      style={{ backgroundColor: hex }} 
                    />
                    <span className="text-[9px] font-mono text-neutral-500">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lookbook Garment Cards */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-medium text-neutral-500 block">
                Wardrobe Ensemble Components
              </span>
              {INITIAL_OUTFIT_SUGGESTIONS[0].items.slice(0, 4).map((it) => (
                <div
                  key={it.id}
                  onClick={() => onSelectItem(it)}
                  className="p-3 bg-[#F8F7F4] hover:bg-white rounded-xl border border-[#E6E2DC] hover:border-neutral-900 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 border border-neutral-200">
                      <img
                        src={it.image}
                        alt={it.title}
                        className="max-h-8 w-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">{it.brand}</span>
                      <span className="text-xs font-semibold text-neutral-900 block truncate max-w-[180px]">{it.title}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-900">${it.price}</span>
                </div>
              ))}
            </div>

            {/* Quick Action: Try Full Outfit in Changing Room */}
            <button
              onClick={() => onOpenTryOn(INITIAL_OUTFIT_SUGGESTIONS[0].items[0])}
              className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Project Ensemble into Virtual Try-On</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
