import React from 'react';
import { Smartphone, ShieldCheck, Github, Globe, Heart, CheckCircle2, Lock } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>
              <span className="font-extrabold text-white text-base">
                SIRAJ AHMED <span className="text-cyan-400">TECH</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Official distribution repository for independent Android software by Siraj Ahmed. Providing direct, verified standalone APK packages with zero bloatware, transparent manifests, and offline-first security.
            </p>

            <div className="flex items-center gap-4 text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Standalone Packages</span>
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero Telemetry Policy</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-mono font-semibold uppercase tracking-wider text-slate-200 text-xs">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Home &amp; Featured Releases
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apps')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  All Applications Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  About Siraj Ahmed Tech
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Android Compatibility */}
          <div className="space-y-3">
            <h4 className="font-mono font-semibold uppercase tracking-wider text-slate-200 text-xs">
              Android OS Support
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Target Platform</span>
                <span className="text-cyan-400 font-semibold">ARM64 &amp; x86_64</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Supported OS</span>
                <span className="text-emerald-400 font-semibold">Android 8.0 - 15+</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Package Type</span>
                <span className="text-slate-200">Direct .apk Binary</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & status */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>&copy; {new Date().getFullYear()} Siraj Ahmed Tech. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Standalone Distribution Server Live</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
