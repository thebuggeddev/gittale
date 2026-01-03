import React from 'react';
import { StoryEvent, RepoInfo, StoryType } from '../types';
import { NeoCard } from './NeoComponents';
import { Trophy, Flame, Calendar, Users } from 'lucide-react';

interface StatsBoardProps {
  events: StoryEvent[];
  repoInfo: RepoInfo;
}

export const StatsBoard: React.FC<StatsBoardProps> = ({ events, repoInfo }) => {
  if (events.length === 0) return null;

  // Calculate stats
  const totalExp = events.reduce((acc, curr) => acc + curr.stats.exp, 0);
  
  const typeCounts = events.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<StoryType, number>);

  const topContributor = events.reduce((acc, curr) => {
    acc[curr.authorName] = (acc[curr.authorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Fix: Explicitly type the sort arguments to avoid "arithmetic operation must be of type 'any', 'number'..." errors
  const bestAuthor = Object.entries(topContributor).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {/* Total XP Card */}
      <NeoCard className="p-4 flex flex-col justify-between" bgColor="bg-yellow-100 dark:bg-yellow-900/50" borderColor="border-black dark:border-yellow-500">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-800 dark:text-yellow-300">Total XP</span>
          <Trophy className="text-yellow-600 dark:text-yellow-400" size={20} />
        </div>
        <div className="mt-2">
          <span className="text-4xl font-black text-black dark:text-white">{totalExp.toLocaleString()}</span>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">Story Points Generated</p>
        </div>
      </NeoCard>

      {/* Top Class Card */}
      <NeoCard className="p-4 flex flex-col justify-between" bgColor="bg-red-100 dark:bg-red-900/50" borderColor="border-black dark:border-red-500">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-300">Most Active</span>
          <Flame className="text-red-600 dark:text-red-400" size={20} />
        </div>
        <div className="mt-2">
           <span className="text-2xl font-black text-black dark:text-white truncate block">
             {/* Fix: Explicitly type the sort arguments here as well */}
             {Object.entries(typeCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0] || 'None'}
           </span>
           <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">Dominant Activity</p>
        </div>
      </NeoCard>

      {/* Hero Card */}
      <NeoCard className="p-4 flex flex-col justify-between" bgColor="bg-blue-100 dark:bg-blue-900/50" borderColor="border-black dark:border-blue-500">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-800 dark:text-blue-300">Party Leader</span>
          <Users className="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <div className="mt-2">
           <span className="text-xl font-black text-black dark:text-white truncate block">
             {bestAuthor ? bestAuthor[0] : 'None'}
           </span>
           <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
             {bestAuthor ? `${bestAuthor[1]} contributions` : 'No data'}
           </p>
        </div>
      </NeoCard>

      {/* Timeline Card */}
      <NeoCard className="p-4 flex flex-col justify-between" bgColor="bg-green-100 dark:bg-green-900/50" borderColor="border-black dark:border-green-500">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-green-800 dark:text-green-300">Era</span>
          <Calendar className="text-green-600 dark:text-green-400" size={20} />
        </div>
        <div className="mt-2">
           <span className="text-lg font-black text-black dark:text-white leading-tight block">
             Last 30 Commits
           </span>
           <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
             {events[events.length - 1]?.date.toLocaleDateString()} - Now
           </p>
        </div>
      </NeoCard>
    </div>
  );
};