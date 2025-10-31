
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { VoiceTyping } from './components/VoiceTyping';
import { Messaging } from './components/Messaging';
import { Menu, X } from 'lucide-react';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.TYPING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-md bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static z-20 h-full transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <Sidebar mode={mode} setMode={setMode} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {mode === AppMode.TYPING ? <VoiceTyping /> : <Messaging />}
        </div>
      </main>
    </div>
  );
}
