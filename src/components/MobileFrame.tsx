import React from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Moon,
  Sun,
  Maximize2,
  Code2,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { useProfileStore } from '../store/profileStore';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const {
    deviceSkin,
    setDeviceSkin,
    isDarkMode,
    toggleDarkMode,
    setShowInspector,
  } = useProfileStore();

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (deviceSkin === 'fullscreen') {
    return (
      <div className="w-full h-full min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
        {/* Top Control Bar */}
        <div className="shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg">
              React Native Simulator
            </span>
            <span className="text-xs font-medium text-slate-500">Fullscreen Mode</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInspector(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex items-center gap-1.5 cursor-pointer"
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Intern Assignment Checklist (16/16)</span>
            </button>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setDeviceSkin('iphone')}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Frame</span>
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md mx-auto h-[calc(100vh-50px)] overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-900/95 py-6 px-4 flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Top Floating Control Bar */}
      <div className="mb-4 flex items-center gap-2 bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-lg select-none z-30">
        <div className="flex items-center gap-1 px-1">
          <button
            type="button"
            onClick={() => setDeviceSkin('iphone')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              deviceSkin === 'iphone'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            iPhone 15 Pro
          </button>
          <button
            type="button"
            onClick={() => setDeviceSkin('android')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              deviceSkin === 'android'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Pixel 8 Pro
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <button
          type="button"
          onClick={toggleDarkMode}
          title="Toggle App Dark Mode"
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-300" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setDeviceSkin('fullscreen')}
          title="Maximize viewport"
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-700" />

        <button
          type="button"
          onClick={() => setShowInspector(true)}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:brightness-110 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Assignment Inspector (16/16)</span>
        </button>
      </div>

      {/* Mobile Device Mockup */}
      <div
        className={`relative w-full max-w-[390px] h-[780px] bg-black ${
          deviceSkin === 'iphone' ? 'rounded-[50px]' : 'rounded-[40px]'
        } p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border-2 border-slate-700 flex flex-col`}
      >
        {/* Screen inner container */}
        <div
          className={`w-full h-full bg-slate-50 dark:bg-slate-950 ${
            deviceSkin === 'iphone' ? 'rounded-[38px]' : 'rounded-[28px]'
          } overflow-hidden flex flex-col relative select-none`}
        >
          {/* Mobile Status Bar */}
          <div className="shrink-0 h-10 w-full px-7 flex items-center justify-between text-slate-900 dark:text-white text-xs font-semibold z-40 bg-transparent">
            {/* Clock */}
            <span className="text-[12px] font-bold tracking-tight">{currentTime}</span>

            {/* Dynamic Island / Notch */}
            {deviceSkin === 'iphone' ? (
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900/50" />
                </div>
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800" />
            )}

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 w-full h-[calc(100%-40px)] flex flex-col overflow-hidden relative">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-3 w-full shrink-0 flex items-center justify-center bg-transparent pointer-events-none pb-1">
            <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
