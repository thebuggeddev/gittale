import React, { useMemo } from 'react';
import { RepoInfo, StoryEvent, StoryType } from '../types';
import { NeoCard } from './NeoComponents';
import { Medal, CalendarDays, Users, Zap, Bug, Crown, Rocket, Star, Shield, Gem } from 'lucide-react';

interface AchievementsProps {
  repoInfo: RepoInfo;
  events: StoryEvent[];
  contributorCount: number;
}

export const Achievements: React.FC<AchievementsProps> = ({ repoInfo, events, contributorCount }) => {
  
  // Calculate Repo "Aura" (Vibe) based on stats
  const aura = useMemo(() => {
    if (!events.length) return { title: "Dormant", color: "text-gray-500", icon: <Shield size={32} /> };
    
    const types = events.map(e => e.type);
    const featureCount = types.filter(t => t === StoryType.FEATURE).length;
    const fixCount = types.filter(t => t === StoryType.FIX).length;
    const docCount = types.filter(t => t === StoryType.DOCS).length;
    
    if (repoInfo.stargazers_count > 20000) return { title: "Celestial", color: "text-yellow-500", icon: <SunIcon /> };
    if (fixCount > featureCount * 2) return { title: "Battle Hardened", color: "text-orange-500", icon: <Shield size={32} /> };
    if (docCount > featureCount) return { title: "Scholarly", color: "text-blue-500", icon: <Gem size={32} /> };
    if (featureCount > fixCount * 2) return { title: "Visionary", color: "text-purple-500", icon: <Rocket size={32} /> };
    
    return { title: "Industrious", color: "text-green-500", icon: <Zap size={32} /> };
  }, [repoInfo, events]);

  // Unlock Achievements
  const achievements = [
    {
        id: 'ancient',
        label: 'Ancient Scroll',
        desc: 'Created over 5 years ago',
        unlocked: new Date(repoInfo.created_at).getFullYear() < new Date().getFullYear() - 5,
        icon: <CalendarDays size={20} />,
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
    },
    {
        id: 'starlord',
        label: 'Star Lord',
        desc: 'Over 10,000 Stars',
        unlocked: repoInfo.stargazers_count > 10000,
        icon: <Star size={20} fill="currentColor" />,
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
    },
    {
        id: 'populous',
        label: 'Metropolis',
        desc: 'Over 50 Contributors',
        unlocked: contributorCount > 50,
        icon: <Users size={20} />,
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
    },
    {
        id: 'active',
        label: 'Hyperactive',
        desc: 'Recent Major Activity',
        unlocked: events.some(e => e.isMajor && new Date().getTime() - e.date.getTime() < 7 * 24 * 60 * 60 * 1000),
        icon: <Zap size={20} />,
        color: 'bg-red-100 dark:bg-red-900/30 text-red-600'
    },
    {
        id: 'fixer',
        label: 'Exterminator',
        desc: '>20% Bug Fixes',
        unlocked: events.filter(e => e.type === StoryType.FIX).length / events.length > 0.2,
        icon: <Bug size={20} />,
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600'
    },
    {
        id: 'royal',
        label: 'Crown Jewel',
        desc: 'Top 1% Reputation',
        unlocked: repoInfo.stargazers_count > 50000,
        icon: <Crown size={20} />,
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* Project Aura Card */}
        <NeoCard className="p-6 md:col-span-1 flex flex-col justify-center items-center text-center relative overflow-hidden" bgColor="bg-white dark:bg-neutral-800">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
           <div className="mb-4 p-4 rounded-full bg-gray-50 dark:bg-neutral-700 border-2 border-black dark:border-gray-500 shadow-sm">
             <span className={`${aura.color}`}>{aura.icon}</span>
           </div>
           <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Project Aura</h4>
               <h3 className={`text-3xl font-black ${aura.color} uppercase`}>{aura.title}</h3>
           </div>
        </NeoCard>

        {/* Badges Grid */}
        <NeoCard className="p-6 md:col-span-2" bgColor="bg-white dark:bg-neutral-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-black dark:text-white flex items-center gap-2">
                    <Medal className="text-yellow-500" />
                    Achievements
                </h3>
                <span className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded">
                    {unlockedCount} / {achievements.length} Unlocked
                </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievements.map(badge => (
                    <div 
                        key={badge.id}
                        className={`
                            border-2 rounded-lg p-3 flex flex-col items-center text-center gap-2 transition-all
                            ${badge.unlocked 
                                ? `${badge.color} border-black dark:border-transparent opacity-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none` 
                                : 'bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 opacity-50 grayscale'
                            }
                        `}
                    >
                        <div className="p-2 bg-white/50 rounded-full">{badge.icon}</div>
                        <div>
                            <p className="font-bold text-sm leading-tight">{badge.label}</p>
                            <p className="text-[10px] font-medium opacity-80 mt-1">{badge.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </NeoCard>
    </div>
  );
};

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);
