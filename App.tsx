import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Moon, Sun, Key } from 'lucide-react';
import { TokenModal } from './components/TokenModal';
import { HomePage } from './pages/HomePage';
import { RepoPage } from './pages/RepoPage';

// Layout Component contains Header, Theme Toggle, Token Modal Logic
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const navigate = useNavigate();

  // Listen for custom event from RepoPage to open token modal
  useEffect(() => {
    const handleOpenModal = () => setShowTokenModal(true);
    window.addEventListener('open-token-modal', handleOpenModal);
    return () => window.removeEventListener('open-token-modal', handleOpenModal);
  }, []);

  // Theme Toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen pb-20 bg-[#fdfbf7] dark:bg-[#1a1a1a] transition-colors duration-300">
      
      {showTokenModal && (
        <TokenModal onClose={() => setShowTokenModal(false)} />
      )}

      <header className="bg-white dark:bg-neutral-900 border-b-2 border-black dark:border-neutral-700 transition-colors duration-300 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div 
              className="inline-flex items-center gap-3 bg-amber-300 dark:bg-amber-500 border-2 border-black px-6 py-2 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/')}
            >
              <BookOpen size={24} className="text-black" />
              <h1 className="text-xl font-black tracking-tight text-black">GitTale</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
               {/* Token */}
               <button 
                  onClick={() => setShowTokenModal(true)}
                  title="API Settings"
                  className="p-2.5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-500 rounded-full hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-[2px] active:shadow-none"
                >
                  <Key className="text-black dark:text-white" size={18} />
                </button>

               {/* Theme */}
               <button 
                  onClick={() => setIsDark(!isDark)}
                  className="p-2.5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-500 rounded-full hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-[2px] active:shadow-none"
                >
                  {isDark ? <Sun className="text-yellow-400" size={18} /> : <Moon className="text-black" size={18} />}
                </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
         {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/repo/:owner/:repoName" element={<RepoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;