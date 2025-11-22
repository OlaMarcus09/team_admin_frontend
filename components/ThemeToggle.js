import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = "" }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <button 
        onClick={toggleTheme}
        className={`flex items-center justify-center p-2 rounded-sm border transition-all duration-200 ${className} ${darkMode 
            ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
            : 'bg-white border-slate-200 text-orange-500 hover:bg-slate-50'}`}
        title="Toggle Theme"
    >
        {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
