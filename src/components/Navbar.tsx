import React from 'react';
import { 
  Smartphone, 
  Layers, 
  Info
} from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  appsCount: number;
}

export function Navbar({ 
  currentView, 
  onNavigate, 
  appsCount
}: NavbarProps) {
  return (
    <header id="main-header" className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          id="nav-brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-lg shadow-cyan-950/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                SIRAJ AHMED <span className="text-cyan-400">TECH</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                APK Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Verified Android Applications Repository
            </p>
          </div>
        </button>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            id="nav-link-home"
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            id="nav-link-apps"
            onClick={() => onNavigate('apps')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'apps'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Apps</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-cyan-300 border border-slate-700">
              {appsCount}
            </span>
          </button>

          <button
            type="button"
            id="nav-link-about"
            onClick={() => onNavigate('about')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'about'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">About</span>
          </button>

        </nav>
      </div>
    </header>
  );
}
