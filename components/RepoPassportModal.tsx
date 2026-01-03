import React, { useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { RepoInfo, Languages } from '../types';
import { NeoButton } from './NeoComponents';
import { X, Download, Loader2, Globe, Shield, Fingerprint, Plane, CheckCircle2, Crown, Star, Hexagon, Zap } from 'lucide-react';
import { generateRepoTitle } from '../utils/storyGenerator';

interface RepoPassportModalProps {
  repoInfo: RepoInfo;
  languages: Languages;
  onClose: () => void;
}

// Enhanced themes with security patterns
const getPassportTheme = (lang: string | null) => {
  const l = (lang || '').toLowerCase();
  
  // Base patterns
  const patterns = {
    dots: "radial-gradient(circle, currentColor 1px, transparent 1px)",
    grid: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
    lines: "repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 10px)",
    waves: "radial-gradient(circle at 100% 50%, transparent 20%, currentColor 21%, currentColor 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, currentColor 21%, currentColor 34%, transparent 35%, transparent) 0 50px"
  };

  if (['javascript', 'typescript', 'html', 'css', 'vue', 'svelte', 'react'].some(x => l.includes(x))) {
    return { 
      bg: 'bg-[#fffbeb]',
      header: 'bg-[#1a1a1a]', 
      accent: 'text-amber-600',
      border: 'border-amber-500',
      stamp: 'text-blue-700', 
      pattern: patterns.grid,
      patternColor: 'rgba(245, 158, 11, 0.05)', 
      district: 'CYBER DISTRICT',
      emblem: '⚡'
    };
  }
  if (['python', 'jupyter', 'r', 'matlab'].some(x => l.includes(x))) {
    return { 
      bg: 'bg-[#f0fdf4]',
      header: 'bg-[#064e3b]', 
      accent: 'text-emerald-700',
      border: 'border-emerald-600',
      stamp: 'text-purple-700', 
      pattern: patterns.dots,
      patternColor: 'rgba(16, 185, 129, 0.1)', 
      district: 'DATA SECTOR',
      emblem: '🐍'
    };
  }
  if (['rust', 'c', 'cpp', 'c++', 'go', 'java', 'c#', 'assembly'].some(x => l.includes(x))) {
    return { 
      bg: 'bg-[#f8fafc]',
      header: 'bg-[#334155]', 
      accent: 'text-slate-700',
      border: 'border-slate-500',
      stamp: 'text-red-700',
      pattern: patterns.lines,
      patternColor: 'rgba(100, 116, 139, 0.05)', 
      district: 'INDUSTRIAL ZONE',
      emblem: '⚙️'
    };
  }
  
  // Default / Universal
  return { 
    bg: 'bg-[#eff6ff]',
    header: 'bg-[#1e3a8a]', 
    accent: 'text-blue-800',
    border: 'border-blue-600',
    stamp: 'text-green-700',
    pattern: patterns.waves,
    patternColor: 'rgba(59, 130, 246, 0.05)', 
    district: 'GENERAL ASSEMBLY',
    emblem: '🌐'
  };
};

// --- Improved Stamp Components ---

const StatusStamp: React.FC<{ stars: number }> = ({ stars }) => {
  // Logic for stamp tier
  let Tier = 'VISITOR';
  let Color = 'text-stone-500 border-stone-500';
  let Icon = <Plane size={24} strokeWidth={2.5} />;
  let RingStyle = 'border-[3px]';
  let StarCount = 0;

  if (stars >= 40000) {
     Tier = 'AMBASSADOR';
     Color = 'text-amber-600 border-amber-600';
     Icon = <Crown size={32} strokeWidth={2.5} />;
     RingStyle = 'border-[4px] border-double';
     StarCount = 5;
  } else if (stars >= 10000) {
     Tier = 'DIPLOMAT';
     Color = 'text-violet-700 border-violet-700';
     Icon = <Shield size={28} strokeWidth={2.5} />;
     RingStyle = 'border-[3px]';
     StarCount = 3;
  } else if (stars >= 2000) {
     Tier = 'CITIZEN';
     Color = 'text-blue-700 border-blue-700';
     Icon = <CheckCircle2 size={26} strokeWidth={2.5} />;
     RingStyle = 'border-[3px]';
     StarCount = 1;
  } else if (stars >= 500) {
     Tier = 'RESIDENT';
     Color = 'text-emerald-700 border-emerald-700';
     Icon = <Hexagon size={26} strokeWidth={2.5} />;
     RingStyle = 'border-[3px]';
     StarCount = 0;
  }

  return (
    <div className={`
      w-32 h-32 rounded-full ${RingStyle} ${Color}
      flex items-center justify-center p-1.5
      rotate-[-12deg] opacity-85 mix-blend-multiply relative
      transition-transform hover:scale-105 duration-300
    `}>
        {/* Grunge overlay for realistic ink look */}
        <div className="absolute inset-0 rounded-full bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

        {/* Inner Dashed Ring */}
        <div className={`w-full h-full rounded-full border-[2px] border-dashed ${Color} flex flex-col items-center justify-center relative`}>
            
            {/* Top Stars Arched */}
            {StarCount > 0 && (
              <div className="absolute top-2.5 flex gap-1">
                 {[...Array(StarCount)].map((_, i) => (
                    <Star key={i} size={8} className="fill-current" />
                 ))}
              </div>
            )}

            <div className={`${StarCount > 0 ? 'mt-2' : ''} mb-0.5 transform scale-110`}>{Icon}</div>
            
            <div className="text-center leading-none">
                <div className="text-[0.5rem] uppercase font-bold tracking-[0.2em] opacity-70 mb-0.5">Rank</div>
                <div className={`font-black font-serif uppercase leading-none ${Tier === 'AMBASSADOR' ? 'text-[0.8rem] tracking-tight' : 'text-[1rem] tracking-tighter'}`}>
                  {Tier}
                </div>
            </div>

            <div className="absolute bottom-3 text-[0.55rem] font-mono font-bold tracking-widest opacity-80 border-t border-current pt-0.5 px-2">
               CL-{Math.floor(stars/100) + 1}
            </div>
        </div>
    </div>
  );
};

const ImmigrationStamp = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    
    return (
        <div className="
            w-40 h-24 border-[3px] border-indigo-900 rounded-lg
            rotate-6 opacity-85 mix-blend-multiply text-indigo-900
            flex flex-col p-1.5 gap-1 bg-transparent
            shadow-[0_0_2px_rgba(49,46,129,0.2)]
        ">
            {/* Inner Border Container */}
            <div className="border-[1.5px] border-indigo-900 rounded h-full flex flex-col items-center justify-between p-1 relative overflow-hidden">
                
                {/* Security Hatching Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, currentColor 3px, currentColor 4px)' }}></div>

                {/* Top Header */}
                <div className="w-full flex justify-between items-center px-1 border-b border-indigo-900/30 pb-1 z-10">
                    <Globe size={14} strokeWidth={2.5} />
                    <span className="text-[9px] font-black uppercase tracking-widest">GitTale Entry</span>
                    <Zap size={14} strokeWidth={2.5} />
                </div>

                {/* Main Date Area */}
                <div className="flex-1 flex flex-col items-center justify-center z-10">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-900/70">Arrived</span>
                    <span className="text-xl font-black font-mono tracking-tighter transform -rotate-1">{dateStr}</span>
                </div>

                {/* Footer Info */}
                <div className="w-full flex justify-between items-center pt-1 border-t border-indigo-900/30 z-10">
                    <div className="flex flex-col leading-none">
                       <span className="text-[6px] font-bold uppercase opacity-60">Port</span>
                       <span className="text-[8px] font-black font-mono">TCP/443</span>
                    </div>
                    <div className="border border-indigo-900 rounded px-1.5 py-0.5 bg-indigo-900/5">
                        <span className="text-[8px] font-black uppercase tracking-wider">ADMITTED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const RepoPassportModal: React.FC<RepoPassportModalProps> = ({ repoInfo, languages, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const title = generateRepoTitle(repoInfo.stargazers_count, repoInfo.forks_count);
  const theme = useMemo(() => getPassportTheme(repoInfo.language), [repoInfo.language]);

  // Generate a fake MRZ (Machine Readable Zone) code
  const mrz = useMemo(() => {
    const pad = (str: string, len: number) => (str + '<'.repeat(len)).substring(0, len);
    const repoName = repoInfo.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const ownerName = repoInfo.owner.login.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const id = repoInfo.id.toString();
    const dob = new Date(repoInfo.created_at).toISOString().slice(2,10).replace(/-/g, '');
    
    const line1 = `P<GIT${pad(ownerName, 39)}`;
    const line2 = `${pad(repoName, 14)}${id}<${(Math.floor(Math.random() * 9)).toString()}${dob}M${pad(repoInfo.language?.substring(0,3).toUpperCase() || 'UNK', 3)}<<<<<<<<<<<`;
    
    return { line1, line2 };
  }, [repoInfo]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 3, 
        logging: false,
        allowTaint: true,
      });
      const link = document.createElement('a');
      link.download = `passport-${repoInfo.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert("Error generating passport image.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        
        {/* Passport Container */}
        <div 
          ref={cardRef} 
          className={`
            ${theme.bg} rounded-[24px] overflow-hidden shadow-[0px_20px_60px_rgba(0,0,0,0.6)] 
            relative flex flex-col w-full aspect-[1.58]
            border-8 border-white
          `}
        >
          {/* Security Pattern Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-100 z-0" 
            style={{ 
              backgroundImage: theme.pattern, 
              backgroundSize: '30px 30px',
              color: theme.patternColor
            }}
          />

          {/* Central Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0 pointer-events-none">
            <Shield size={400} />
          </div>

          {/* Header Strip */}
          <div className={`${theme.header} h-20 w-full relative z-10 flex items-center justify-between px-8 text-white overflow-hidden shadow-lg`}>
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             
             <div className="flex items-center gap-4 relative z-10">
               <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                 <Globe className="w-6 h-6 text-white" />
               </div>
               <div className="leading-tight">
                 <p className="font-medium text-[10px] tracking-[0.3em] uppercase opacity-80">Union of Open Source</p>
                 <h1 className="font-serif font-black text-2xl tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-500 drop-shadow-sm">
                   Passport
                 </h1>
               </div>
             </div>
             
             <div className="flex items-center gap-2 relative z-10">
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                  <span className="text-sm font-black">{theme.emblem}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[8px] opacity-70 tracking-[0.2em] uppercase">Code</p>
                  <p className="font-mono font-bold text-lg leading-none">GIT</p>
                </div>
             </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-8 relative flex gap-8 z-10">
             
             {/* Left Column: Photo & Signature */}
             <div className="w-[32%] flex flex-col gap-4">
                {/* Photo Frame */}
                <div className="relative aspect-[3/4] p-1 bg-white shadow-lg border-[2px] border-neutral-300">
                   <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50 mix-blend-overlay pointer-events-none"></div>
                   <div className="absolute inset-0 z-20 flex items-center justify-center opacity-20 pointer-events-none">
                      <Shield size={80} className="text-white drop-shadow-md" />
                   </div>
                   
                   <img 
                      src={repoInfo.owner.avatar_url} 
                      crossOrigin="anonymous" 
                      className="w-full h-full object-cover grayscale contrast-125 sepia-[0.1]"
                      alt="Owner"
                   />
                </div>
                
                {/* Signature */}
                <div className="text-center relative">
                   <p className="font-handwriting text-3xl -rotate-2 text-blue-900/80 font-bold mix-blend-multiply z-10 relative">
                     {repoInfo.owner.login}
                   </p>
                   <div className="h-[1px] w-full bg-black/20 absolute bottom-2"></div>
                </div>
             </div>

             {/* Right Column: Data Fields */}
             <div className="flex-1 flex flex-col justify-start pt-1 relative">
                
                {/* Ghost Image Background for Security */}
                <div className="absolute right-0 bottom-10 w-32 h-32 opacity-10 mix-blend-multiply pointer-events-none rounded-full overflow-hidden grayscale">
                   <img src={repoInfo.owner.avatar_url} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                   
                   <div className="col-span-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Type / Type</p>
                      <p className="text-lg font-bold font-mono text-black leading-none pb-1">P</p>
                   </div>
                   
                   <div className="col-span-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Country Code / Pays</p>
                      <p className="text-lg font-bold font-mono text-black leading-none pb-1">GIT</p>
                   </div>

                   <div className="col-span-2">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Repository / Dépôt</p>
                      {/* Fixed: Added padding-bottom, relaxed leading, removed tracking-tight to prevent clipping */}
                      <p className={`text-2xl font-black font-mono uppercase truncate leading-snug pb-1 ${theme.accent}`}>{repoInfo.name}</p>
                   </div>

                   <div className="col-span-2">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Title / Titre</p>
                      {/* Fixed: Added padding-bottom to prevent descender clipping */}
                      <p className="text-lg font-bold uppercase text-black font-serif tracking-wide leading-snug pb-1">{title}</p>
                   </div>

                   <div>
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Origin / Origine</p>
                      {/* Fixed: Removed truncate to allow full text if possible, or added better clipping handling */}
                      <p className="text-md font-bold font-mono text-black uppercase leading-snug pb-1 overflow-hidden text-ellipsis whitespace-nowrap">{repoInfo.language || 'UNIVERSAL'}</p>
                   </div>

                   <div>
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Date of Birth / Date</p>
                      <p className="text-md font-bold font-mono text-black leading-snug pb-1">{new Date(repoInfo.created_at).toLocaleDateString()}</p>
                   </div>
                   
                   <div className="col-span-2 mt-2">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Authority / Autorité</p>
                      <p className="text-xs font-bold font-mono text-black uppercase flex items-center gap-2 leading-snug pb-1">
                         <Fingerprint size={12} />
                         GITHUB.COM / {theme.district}
                      </p>
                   </div>
                </div>

                {/* REALISTIC PASSPORT STAMPS */}
                {/* Fixed: Adjusted positioning to minimize overlap with data fields */}
                <div className="absolute right-0 top-0 bottom-0 w-44 pointer-events-none flex flex-col justify-between py-2 z-20">
                    
                    {/* 1. Immigration Entry Stamp - Shifted Right */}
                    <div className="transform translate-x-6 scale-90 origin-right">
                       <ImmigrationStamp />
                    </div>

                    {/* 2. Tiered Status Stamp - Shifted Right and Down to clear 'Date of Birth' */}
                    <div className="transform translate-x-2 translate-y-8 scale-90 origin-bottom-right">
                       <StatusStamp stars={repoInfo.stargazers_count} />
                    </div>
                </div>

             </div>
          </div>

          {/* Machine Readable Zone (MRZ) */}
          <div className="bg-white p-6 pb-8 font-mono text-lg md:text-xl tracking-[0.2em] leading-relaxed uppercase text-[#333] font-medium z-10 break-all select-all relative">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
             <p className="truncate scale-y-110">{mrz.line1}</p>
             <p className="truncate scale-y-110">{mrz.line2}</p>
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
           <NeoButton onClick={onClose} variant="secondary">
             <X size={20} /> Close
           </NeoButton>
           <NeoButton onClick={handleDownload} disabled={downloading}>
             {downloading ? <Loader2 className="animate-spin" /> : <Download size={20} />} 
             {downloading ? 'Minting...' : 'Download Passport'}
           </NeoButton>
        </div>
      </div>
    </div>
  );
};