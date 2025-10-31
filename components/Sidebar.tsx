
import React from 'react';
import { MessageSquare, Type, Languages, Github } from 'lucide-react';
import { AppMode } from '../types';

interface SidebarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-rose-500 text-white shadow-md'
        : 'text-slate-600 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-700'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ mode, setMode }) => {
  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4 shadow-lg">
      <div className="flex items-center mb-8">
        <img src="https://picsum.photos/40/40?grayscale" alt="Logo" className="rounded-full"/>
        <h1 className="text-xl font-bold ml-3 text-rose-500">Nepali Voice</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem
          icon={<Type size={20} />}
          label="Voice Typing"
          isActive={mode === AppMode.TYPING}
          onClick={() => setMode(AppMode.TYPING)}
        />
        <NavItem
          icon={<MessageSquare size={20} />}
          label="Smart Messaging"
          isActive={mode === AppMode.MESSAGING}
          onClick={() => setMode(AppMode.MESSAGING)}
        />
      </nav>

      <div className="mt-auto">
        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
          <h3 className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-200">Related Tools</h3>
          <a href="#" className="flex items-center text-xs text-rose-500 hover:underline">
            <Languages size={16} className="mr-2" />
            Nepali to English Translation
          </a>
        </div>
        <div className="text-center mt-4">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-slate-500 hover:text-rose-500">
                <Github size={14} className="mr-1.5" />
                View on GitHub
            </a>
        </div>
      </div>
    </aside>
  );
};
