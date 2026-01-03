import React, { useState, useMemo } from 'react';
import { StoryEvent, StoryType } from '../types';
import { NeoCard, Badge } from './NeoComponents';
import { TYPE_COLORS, TYPE_ICONS, RARITY_BORDERS } from '../constants';
import { ChevronDown, ChevronUp, ExternalLink, Calendar, Zap, Sparkles, Ticket } from 'lucide-react';

interface TimelineProps {
  events: StoryEvent[];
  onShowTicket: (event: StoryEvent) => void;
}

const StoryCard: React.FC<{ event: StoryEvent; onShowTicket: () => void }> = ({ event, onShowTicket }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeString = event.date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Dynamic Styles based on Impact/Rarity
  const rarityBorder = RARITY_BORDERS[event.impact] || 'border-black dark:border-neutral-200';
  const isCritical = event.impact === 'Critical';

  return (
    <div className="relative mb-6">
      <NeoCard 
        borderColor={rarityBorder}
        className={`
          cursor-pointer group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]
          ${isExpanded ? 'bg-amber-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-800'}
          ${isCritical ? 'ring-2 ring-red-400 ring-offset-2 dark:ring-offset-neutral-900' : ''}
        `}
      >
        <div onClick={() => setIsExpanded(!isExpanded)} className="p-0 overflow-hidden">
          
          {/* Card Header (Cost/Stats Strip) */}
          <div className="flex justify-between items-center bg-gray-100 dark:bg-neutral-900 px-4 py-2 border-b-2 border-black dark:border-neutral-700">
             <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Zap size={14} className="fill-yellow-400 text-black dark:text-yellow-400" /> {event.stats.mana} Cost</span>
                <span>•</span>
                <span>{timeString}</span>
             </div>
             
             {/* Ticket Action */}
             <button 
               onClick={(e) => { e.stopPropagation(); onShowTicket(); }}
               className="text-xs font-bold flex items-center gap-1 text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
               title="View Story Card"
             >
               <Ticket size={14} /> <span className="hidden md:inline">CARD</span>
             </button>
          </div>

          <div className="p-5 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Avatar / Hero Image */}
              <div className="flex-shrink-0">
                 <div className="relative">
                    <img 
                      src={event.authorAvatar} 
                      alt={event.authorName}
                      className="w-16 h-16 rounded-xl border-2 border-black dark:border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none bg-gray-200"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white">
                      LVL {Math.floor(event.stats.exp / 10)}
                    </div>
                 </div>
              </div>

              <div className="flex-1">
                {/* Type & Title */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl font-black text-black dark:text-white leading-tight">
                    {event.title}
                  </h3>
                  <div className={`
                    flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border-2 border-black dark:border-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none
                    ${TYPE_COLORS[event.type]}
                  `}>
                    {TYPE_ICONS[event.type]}
                  </div>
                </div>

                {/* Narrative Box */}
                <div className={`
                  p-3 rounded-lg border-2 border-black/10 dark:border-white/10 mb-3
                  ${event.impact === 'Critical' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-neutral-900/50'}
                `}>
                   <p className="text-gray-800 dark:text-gray-200 font-medium italic text-sm md:text-base leading-relaxed font-serif">
                     "{event.narrative}"
                   </p>
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                     <Badge 
                       label={event.type} 
                       colorClass={TYPE_COLORS[event.type]} 
                     />
                     {event.impact === 'Critical' && (
                       <Badge label="Legendary" colorClass="bg-red-500 text-white" icon="🔥" />
                     )}
                   </div>
                   <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm">
                      <Sparkles size={14} />
                      +{event.stats.exp} XP
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="px-6 pb-6 pt-0 border-t-2 border-black/10 dark:border-neutral-700 mt-2 animate-fadeIn bg-gray-50 dark:bg-neutral-900/30">
              <div className="pt-4 space-y-4">
                 <div className="space-y-2">
                   <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Author</h4>
                   <div className="flex items-center gap-2">
                      <span className="font-bold text-black dark:text-white">{event.authorName}</span>
                      <span className="text-gray-500 text-sm">invoked this change</span>
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Inscription</h4>
                   <pre className="bg-black text-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-4 rounded-xl text-xs md:text-sm overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
                     {event.rawMessage}
                   </pre>
                 </div>
                 
                 <div className="flex justify-end pt-2">
                   <a 
                     href={event.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 text-sm font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                     onClick={(e) => e.stopPropagation()}
                   >
                     <span>Read Scroll (GitHub)</span>
                     <ExternalLink size={16} />
                   </a>
                 </div>
              </div>
            </div>
          )}
        </div>
      </NeoCard>
    </div>
  );
};

export const Timeline: React.FC<TimelineProps> = ({ events, onShowTicket }) => {
  // Group events by Date
  // Fix: Explicitly type useMemo return to ensure inferred types are correct
  const groupedEvents = useMemo((): Record<string, StoryEvent[]> => {
    const groups: Record<string, StoryEvent[]> = {};
    events.forEach(event => {
      const dateKey = event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });
    return groups;
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <NeoCard className="inline-block p-8 bg-yellow-100 dark:bg-yellow-900/20">
           <div className="text-4xl mb-4">📭</div>
           <h3 className="text-xl font-bold dark:text-white">No stories found yet.</h3>
           <p className="mt-2 text-gray-600 dark:text-gray-400">Enter a repository above to start the journey.</p>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Fix: Explicitly cast Object.entries result to ensure map arguments are typed */}
      {(Object.entries(groupedEvents) as [string, StoryEvent[]][]).map(([date, dayEvents], groupIndex) => (
        <div key={date} className="mb-12 animate-slide-up" style={{ animationDelay: `${groupIndex * 100}ms` }}>
          
          {/* Date Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 bg-black dark:bg-white rounded-full"></div>
            <h2 className="text-lg font-black uppercase tracking-widest text-black dark:text-white bg-white dark:bg-neutral-900 px-4 py-1 border-2 border-black dark:border-gray-500 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              {date}
            </h2>
            <div className="h-0.5 flex-1 bg-black dark:bg-gray-700 opacity-20"></div>
          </div>

          <div className="relative border-l-2 border-dashed border-black/20 dark:border-white/20 ml-5 pl-8 space-y-8">
            {dayEvents.map((event) => (
              <StoryCard key={event.id} event={event} onShowTicket={() => onShowTicket(event)} />
            ))}
          </div>
        </div>
      ))}
      
      <div className="flex justify-center mt-12">
        <div className="bg-black dark:bg-neutral-800 text-white dark:text-gray-400 px-6 py-3 rounded-full text-sm font-bold border border-white/10">
          End of recorded history
        </div>
      </div>
    </div>
  );
};