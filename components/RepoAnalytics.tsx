import React, { useMemo } from 'react';
import { Contributor, Languages, RepoInfo, StoryEvent } from '../types';
import { NeoCard } from './NeoComponents';
import { Users, Code, Star, GitFork, Eye, Clock, Award, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface RepoAnalyticsProps {
  contributors: Contributor[];
  languages: Languages;
  repoInfo: RepoInfo;
  events: StoryEvent[];
}

export const RepoAnalytics: React.FC<RepoAnalyticsProps> = ({ contributors, languages, repoInfo, events }) => {
  // Calculate total lines of code (bytes) to get percentages
  const totalBytes = (Object.values(languages) as number[]).reduce((a, b) => a + b, 0);
  
  // Sort contributors (API usually does this, but ensure)
  const sortedContributors = [...contributors].sort((a, b) => b.contributions - a.contributions);
  const topContributor = sortedContributors[0];
  const restContributors = sortedContributors.slice(1, 6); // Top 2-6
  const newcomer = sortedContributors.length > 10 ? sortedContributors[sortedContributors.length - 1] : null;

  // Limit Languages to top 7
  const topLanguages = Object.entries(languages)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 7);

  // Calculate Activity Rhythm (Morning/Night)
  const rhythm = useMemo(() => {
    if (events.length === 0) return { title: "Unknown", icon: <Clock />, desc: "Not enough data" };
    
    const hours = events.map(e => e.date.getHours());
    const avgHour = hours.reduce((a, b) => a + b, 0) / hours.length;
    
    if (avgHour >= 5 && avgHour < 12) return { title: "Early Bird", icon: <Sunrise className="text-orange-400" />, desc: "Most active in the morning" };
    if (avgHour >= 12 && avgHour < 17) return { title: "Day Walker", icon: <Sun className="text-yellow-500" />, desc: "Most active in the afternoon" };
    if (avgHour >= 17 && avgHour < 22) return { title: "Night Owl", icon: <Sunset className="text-purple-500" />, desc: "Most active in the evening" };
    return { title: "Midnight Oil", icon: <Moon className="text-blue-400" />, desc: "Most active late at night" };
  }, [events]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-slide-up">
      
      {/* Col 1: Hall of Heroes (Contributors) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
             <Award className="text-yellow-500" /> Hall of Heroes
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guild Master (Rank 1) */}
          {topContributor && (
            <a href={topContributor.html_url} target="_blank" rel="noreferrer" className="block group cursor-pointer transition-transform hover:-translate-y-1">
              <NeoCard className="p-6 relative overflow-hidden h-full" bgColor="bg-yellow-100 dark:bg-yellow-900/30" borderColor="border-black dark:border-yellow-500 group-hover:border-yellow-600">
                <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-black px-3 py-1 border-b-2 border-l-2 border-black">
                  MVP
                </div>
                <div className="flex items-center gap-4">
                  <img src={topContributor.avatar_url} className="w-20 h-20 rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" alt="MVP" />
                  <div>
                    <h4 className="text-xl font-black text-black dark:text-white group-hover:underline">{topContributor.login}</h4>
                    <p className="text-sm font-bold text-gray-600 dark:text-yellow-200/80 uppercase tracking-wide">Guild Master</p>
                    <div className="mt-2 text-3xl font-black text-black dark:text-white">
                      {topContributor.contributions} <span className="text-sm text-gray-500 font-normal">commits</span>
                    </div>
                  </div>
                </div>
              </NeoCard>
            </a>
          )}

          {/* Newcomer / Rising Star */}
          {newcomer && (
             <a href={newcomer.html_url} target="_blank" rel="noreferrer" className="block group cursor-pointer transition-transform hover:-translate-y-1">
               <NeoCard className="p-6 h-full" bgColor="bg-green-100 dark:bg-green-900/30" borderColor="border-black dark:border-green-500 group-hover:border-green-600">
                 <div className="flex items-center gap-4">
                   <img src={newcomer.avatar_url} className="w-16 h-16 rounded-full border-2 border-black dark:border-white grayscale group-hover:grayscale-0 transition-all" alt="Newcomer" />
                   <div>
                     <h4 className="text-lg font-black text-black dark:text-white group-hover:underline">{newcomer.login}</h4>
                     <p className="text-sm font-bold text-gray-600 dark:text-green-200/80 uppercase tracking-wide">Rising Star</p>
                     <div className="mt-1 font-bold text-black dark:text-white">
                       {newcomer.contributions} <span className="text-sm text-gray-500 font-normal">commits</span>
                     </div>
                   </div>
                 </div>
              </NeoCard>
             </a>
          )}
        </div>

        {/* Top Contributors List */}
        <NeoCard className="p-6" bgColor="bg-white dark:bg-neutral-800">
           <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm mb-4">Elite Squad</h4>
           <div className="space-y-4">
             {restContributors.map((c, idx) => (
               <div key={c.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-gray-300 w-6">#{idx + 2}</span>
                    <img src={c.avatar_url} className="w-10 h-10 rounded-full border border-black dark:border-gray-500" alt={c.login} />
                    <a href={c.html_url} target="_blank" rel="noreferrer" className="font-bold text-black dark:text-white hover:underline decoration-2 underline-offset-2">
                      {c.login}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gray-100 dark:bg-neutral-700 w-24 md:w-48 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 dark:bg-blue-500" 
                        style={{ width: `${(c.contributions / topContributor.contributions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right text-gray-600 dark:text-gray-400">{c.contributions}</span>
                  </div>
               </div>
             ))}
           </div>
        </NeoCard>
      </div>

      {/* Col 2: Repo Intel (Languages & Stats) */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
           <Code className="text-blue-500" /> Repo Intel
        </h3>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
           <NeoCard className="p-3" noShadow bgColor="bg-gray-50 dark:bg-neutral-800">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">
                <Clock size={14} /> Created
              </div>
              <div className="text-sm font-bold text-black dark:text-white truncate">
                {new Date(repoInfo.created_at).toLocaleDateString()}
              </div>
           </NeoCard>
           <NeoCard className="p-3" noShadow bgColor="bg-gray-50 dark:bg-neutral-800">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">
                <GitFork size={14} /> Forks
              </div>
              <div className="text-lg font-black text-black dark:text-white">
                {repoInfo.forks_count.toLocaleString()}
              </div>
           </NeoCard>
           
           {/* Activity Rhythm (New) */}
           <NeoCard className="col-span-2 p-3 flex items-center justify-between" noShadow bgColor="bg-blue-50 dark:bg-blue-900/20">
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">
                  {rhythm.icon} Rhythm
                </div>
                <div className="text-lg font-black text-black dark:text-white">
                  {rhythm.title}
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 text-right max-w-[100px]">
                {rhythm.desc}
              </div>
           </NeoCard>
        </div>

        {/* Languages Card */}
        <NeoCard className="p-6" bgColor="bg-white dark:bg-neutral-800">
          <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm mb-4">Tech Stack (Top 7)</h4>
          
          <div className="flex h-4 w-full rounded-full overflow-hidden border-2 border-black dark:border-neutral-600 mb-6">
            {topLanguages.map(([lang, bytes]: [string, number], idx) => {
              const colors = ['bg-blue-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400', 'bg-green-400', 'bg-gray-400', 'bg-pink-400'];
              return (
                <div 
                  key={lang}
                  className={colors[idx % colors.length]}
                  style={{ width: `${(bytes / totalBytes) * 100}%` }}
                />
              );
            })}
          </div>

          <div className="space-y-3">
             {topLanguages.map(([lang, bytes]: [string, number], idx) => {
                const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                const colors = ['bg-blue-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400', 'bg-green-400', 'bg-gray-400', 'bg-pink-400'];
                return (
                  <div key={lang} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                       <div className={`w-3 h-3 rounded-full border border-black ${colors[idx % colors.length]}`}></div>
                       <span className="font-bold text-black dark:text-white">{lang}</span>
                    </div>
                    <span className="font-mono text-gray-500">{percentage}%</span>
                  </div>
                );
             })}
          </div>
        </NeoCard>

      </div>
    </div>
  );
};