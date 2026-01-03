import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { StoryEvent } from '../types';
import { TYPE_COLORS, TYPE_ICONS, RARITY_BORDERS } from '../constants';
import { NeoCard, NeoButton, Badge } from './NeoComponents';
import { X, Download, Share2, Sparkles, Zap, GitCommit, Loader2 } from 'lucide-react';
import { generateEventRank } from '../utils/storyGenerator';

interface TicketModalProps {
  event: StoryEvent;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ event, onClose }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Prevent click propagation to close modal when clicking content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    
    try {
      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(ticketRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2, // Higher resolution
      });
      
      const link = document.createElement('a');
      link.download = `gittale-ticket-${event.id.substring(0,7)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("Could not generate image. This might be due to cross-origin images.");
    } finally {
      setDownloading(false);
    }
  };

  const isCritical = event.impact === 'Critical';
  const rarityColor = isCritical ? 'bg-red-500' : 'bg-black';
  const rankTitle = generateEventRank(event.stats.exp);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div className="relative max-w-2xl w-full" onClick={handleContentClick}>
        
        {/* Ticket Container (Ref for download) */}
        <div ref={ticketRef} className="bg-[#fdfbf7] dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[0px_0px_40px_rgba(0,0,0,0.5)] border-4 border-black dark:border-white/20 transform rotate-1 md:rotate-0">
          
          {/* Header Strip */}
          <div className={`${rarityColor} text-white px-6 py-4 flex justify-between items-center`}>
             <div className="flex items-center gap-2">
                <GitCommit size={24} />
                <span className="font-mono text-lg font-bold tracking-wider">GIT-TALE TICKET</span>
             </div>
             <span className="font-mono font-bold opacity-80">{event.id.substring(0,7)}</span>
          </div>

          <div className="flex flex-col md:flex-row">
            
            {/* Left Stub (Date & QR Placeholder) */}
            <div className="md:w-1/3 bg-gray-100 dark:bg-white/5 p-6 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-dashed border-gray-400 relative">
               {/* Semi-circles for ticket punch effect */}
               <div className="absolute -top-3 left-1/2 md:left-auto md:-right-3 md:top-1/2 w-6 h-6 bg-black/60 dark:bg-[#000] rounded-full"></div>
               <div className="absolute -bottom-3 left-1/2 md:left-auto md:-right-3 md:bottom-1/2 w-6 h-6 bg-black/60 dark:bg-[#000] rounded-full"></div>

               <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date Issued</h4>
                 <p className="text-xl font-black text-black dark:text-white">{event.date.toLocaleDateString()}</p>
                 <p className="text-sm font-medium text-gray-500">{event.date.toLocaleTimeString()}</p>
                 
                 <div className="mt-4 inline-block px-3 py-1 bg-black/5 dark:bg-white/10 rounded-lg border border-black/10 dark:border-white/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Class</p>
                    <p className="font-bold text-black dark:text-white">{rankTitle}</p>
                 </div>
               </div>

               <div className="mt-8 md:mt-0 opacity-20">
                  {/* Fake Barcode */}
                  <div className="h-12 w-full flex items-end gap-1">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="bg-black dark:bg-white" style={{ width: Math.random() * 4 + 2 + 'px', height: Math.random() * 100 + '%' }}></div>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono mt-1 text-center text-black dark:text-white">VALID FOR 1 COMMIT</p>
               </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
               
               {/* Background Watermark */}
               <div className="absolute right-[-20px] top-[-20px] text-[150px] opacity-5 pointer-events-none select-none">
                 {TYPE_ICONS[event.type]}
               </div>

               <div className="flex items-center gap-4 mb-4">
                 <div className="relative">
                   {/* Add crossOrigin for html2canvas */}
                   <img src={event.authorAvatar} crossOrigin="anonymous" className="w-16 h-16 rounded-full border-4 border-black dark:border-white shadow-lg" alt="Author" />
                   <div className="absolute -bottom-2 -right-1 bg-yellow-400 border-2 border-black text-xs font-black px-2 py-0.5 rounded-full text-black transform rotate-6">
                     LVL {Math.floor(event.stats.exp/10)}
                   </div>
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-black dark:text-white">{event.authorName}</h3>
                   <Badge label={event.type} colorClass={TYPE_COLORS[event.type]} />
                 </div>
               </div>

               <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4 text-black dark:text-white">
                 {event.title}
               </h2>

               <div className={`p-4 rounded-xl border-2 border-black/10 dark:border-white/10 mb-6 ${isCritical ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-white/5'}`}>
                 <p className="font-serif italic text-lg text-gray-800 dark:text-gray-200">
                   "{event.narrative}"
                 </p>
               </div>

               <div className="flex justify-between items-center">
                 <div className="flex gap-4">
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-gray-400 uppercase">XP Gained</span>
                       <span className="text-xl font-black text-green-500 flex items-center gap-1">
                         <Sparkles size={18} /> {event.stats.exp}
                       </span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-gray-400 uppercase">Mana Cost</span>
                       <span className="text-xl font-black text-blue-500 flex items-center gap-1">
                         <Zap size={18} /> {event.stats.mana}
                       </span>
                    </div>
                 </div>
                 
                 {isCritical && (
                   <div className="bg-red-500 text-white px-3 py-1 text-sm font-black uppercase tracking-widest border-2 border-black transform -rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                     LEGENDARY
                   </div>
                 )}
               </div>

            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-center gap-4 mt-8">
           <NeoButton onClick={onClose} variant="secondary">
             <X size={20} /> Close
           </NeoButton>
           <NeoButton onClick={handleDownload} disabled={downloading}>
             {downloading ? <Loader2 className="animate-spin" /> : <Download size={20} />} 
             {downloading ? 'Printing...' : 'Download Ticket'}
           </NeoButton>
        </div>

      </div>
    </div>
  );
};