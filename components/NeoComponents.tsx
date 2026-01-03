import React from 'react';

// The "Neo-Brutalist" Card
// Thick borders, hard shadows, rounded corners
export const NeoCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  noShadow?: boolean;
  bgColor?: string;
  borderColor?: string;
}> = ({ 
  children, 
  className = '', 
  noShadow = false, 
  bgColor = 'bg-white dark:bg-neutral-800',
  borderColor = 'border-black dark:border-neutral-200'
}) => {
  const shadowClass = noShadow ? '' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]';
  
  // If bgColor is passed explicitly, use it, otherwise default.
  // Note: If passing a specific color, ensure it has dark mode variant if needed, or handle in parent.
  
  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-xl ${shadowClass} ${className} transition-all duration-200`}>
      {children}
    </div>
  );
};

// The "Neo-Brutalist" Button
export const NeoButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  let bgClass = 'bg-sky-400 hover:bg-sky-500 text-black';
  if (variant === 'secondary') bgClass = 'bg-white hover:bg-gray-50 text-black dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600';
  if (variant === 'danger') bgClass = 'bg-orange-400 hover:bg-orange-500 text-black';

  return (
    <button 
      className={`
        ${bgClass} 
        font-bold border-2 border-black dark:border-neutral-200 rounded-full 
        px-6 py-3 
        shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none 
        transition-all duration-150
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Field
export const NeoInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <div className="relative w-full">
      <input 
        className="w-full bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-200 rounded-full px-6 py-4 text-lg font-medium placeholder-gray-500 dark:placeholder-gray-400 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
        {...props}
      />
    </div>
  );
};

export const Badge: React.FC<{ label: string; colorClass: string; icon?: string }> = ({ label, colorClass, icon }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 border-black dark:border-black rounded-lg text-xs font-bold uppercase tracking-wider ${colorClass} text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none`}>
    {icon && <span>{icon}</span>}
    {label}
  </span>
);