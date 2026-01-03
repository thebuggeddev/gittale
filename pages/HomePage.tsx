import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeoCard, Badge, NeoInput, NeoButton } from '../components/NeoComponents';
import { Star, GitFork, ArrowRight, ShieldCheck, Search, Loader2 } from 'lucide-react';

const FEATURED_REPOS = [
  { owner: 'shadcn-ui', name: 'ui', desc: 'Beautifully designed components built with Radix UI and Tailwind CSS.', color: 'bg-zinc-100 dark:bg-zinc-800' },
  { owner: 'tailwindlabs', name: 'tailwindcss', desc: 'A utility-first CSS framework for rapid UI development.', color: 'bg-sky-100 dark:bg-sky-900/30' },
  { owner: 'vercel', name: 'next.js', desc: 'The React Framework for the Web.', color: 'bg-gray-100 dark:bg-gray-800' },
  { owner: 'facebook', name: 'react', desc: 'The library for web and native user interfaces.', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { owner: 'microsoft', name: 'typescript', desc: 'TypeScript is JavaScript with syntax for types.', color: 'bg-blue-50 dark:bg-blue-950/30' },
  { owner: 'torvalds', name: 'linux', desc: 'Linux kernel source tree.', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { owner: 'sveltejs', name: 'svelte', desc: 'Cybernetically enhanced web apps.', color: 'bg-orange-50 dark:bg-orange-900/20' }
];

const SUGGESTIONS = ['facebook/react', 'tailwindlabs/tailwindcss', 'microsoft/typescript'];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [repoInput, setRepoInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent, override?: string) => {
    e.preventDefault();
    const query = override || repoInput;
    if (!query.trim() || !query.includes('/')) {
      alert('Please enter a valid format: "owner/repo"');
      return;
    }
    setLoading(true);
    // Simulate navigation delay for effect
    setTimeout(() => {
        navigate(`/repo/${query}`);
    }, 300);
  };

  return (
    <div className="animate-fadeIn pb-12">
      {/* Hero Section with Search */}
      <div className="text-center max-w-2xl mx-auto mb-16 relative">
        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-black dark:text-white">
          Turn Commit Logs into <span className="bg-sky-400 dark:bg-sky-600 px-3 text-white inline-block transform -rotate-2 border-4 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Epic Stories</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-10">
          Visualize the narrative behind the code as a card-based timeline. 
          Unlock achievements and generate a travel passport for your repos.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <NeoInput 
                  placeholder="owner/repo (e.g. facebook/react)"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                />
              </div>
              <NeoButton type="submit" variant="danger" className="w-full md:w-auto" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
                <span>Explore</span>
              </NeoButton>
            </form>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
           <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest self-center mr-2">Try:</span>
           {SUGGESTIONS.map(s => (
             <button 
               key={s}
               onClick={(e) => handleSearch(e, s)}
               className="text-xs font-bold px-3 py-1 bg-white dark:bg-neutral-800 text-black dark:text-gray-300 hover:bg-yellow-200 dark:hover:bg-yellow-900 dark:hover:text-yellow-200 border-2 border-black dark:border-gray-500 rounded-lg transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Featured Passports Divider */}
      <div className="mb-8 flex items-center gap-4">
         <div className="h-1 bg-black dark:bg-gray-700 flex-1"></div>
         <h3 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
           <ShieldCheck className="text-yellow-500" /> Featured Passports
         </h3>
         <div className="h-1 bg-black dark:bg-gray-700 flex-1"></div>
      </div>

      {/* Featured Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FEATURED_REPOS.map((repo) => (
          <div 
            key={`${repo.owner}/${repo.name}`}
            onClick={() => navigate(`/repo/${repo.owner}/${repo.name}`)}
            className="cursor-pointer group"
          >
            <NeoCard 
              className="h-full p-6 flex flex-col justify-between group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
              bgColor={repo.color}
            >
               <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={`https://github.com/${repo.owner}.png`} 
                      alt={repo.owner}
                      className="w-12 h-12 rounded-lg border-2 border-black dark:border-gray-500 bg-white" 
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold uppercase text-gray-500 truncate">{repo.owner}</p>
                      <h4 className="text-xl font-black text-black dark:text-white truncate">{repo.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                    {repo.desc}
                  </p>
               </div>
               
               <div className="flex justify-between items-center border-t-2 border-black/10 dark:border-white/10 pt-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                    <Star size={14} /> Popular
                  </div>
                  <button className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center transform group-hover:rotate-[-45deg] transition-transform">
                    <ArrowRight size={16} />
                  </button>
               </div>
            </NeoCard>
          </div>
        ))}
      </div>
    </div>
  );
};