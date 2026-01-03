import React, { useState, useEffect } from 'react';
import { NeoCard, NeoButton } from './NeoComponents';
import { X, Key, ShieldCheck } from 'lucide-react';

interface TokenModalProps {
  onClose: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({ onClose }) => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gittale_token');
    if (saved) setToken(saved);
  }, []);

  const handleSave = () => {
    if (token.trim()) {
      localStorage.setItem('gittale_token', token.trim());
    } else {
      localStorage.removeItem('gittale_token');
    }
    // Reload to clear error states and re-fetch with new headers
    window.location.reload(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <NeoCard className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white">
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-3 mb-4 text-black dark:text-white">
            <div className="bg-yellow-400 p-2 rounded-lg border-2 border-black">
                <Key size={24} className="text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase">API Access</h2>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium leading-relaxed text-sm">
            GitHub limits unauthenticated requests to <strong>60 per hour</strong>. 
            To bypass this, provide a Personal Access Token (Classic).
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border-2 border-blue-100 dark:border-blue-800 mb-6">
             <div className="flex items-start gap-2">
                <ShieldCheck className="text-blue-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-blue-800 dark:text-blue-200 font-bold leading-tight">
                   Your token is stored locally in your browser and sent directly to GitHub. No backend server is involved.
                </p>
             </div>
          </div>

          <div className="space-y-4">
             <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-1 block text-gray-500">Personal Access Token</label>
                <input 
                  type="password"
                  placeholder="ghp_..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-600 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all text-black dark:text-white"
                />
             </div>
             
             <NeoButton onClick={handleSave} className="w-full">
               Save & Reload
             </NeoButton>
             
             <div className="text-center">
                <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white hover:underline">
                   Generate a token on GitHub &rarr;
                </a>
             </div>
          </div>

        </NeoCard>
      </div>
    </div>
  );
};