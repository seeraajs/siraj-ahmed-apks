import React from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  Mail, 
  Globe, 
  Code, 
  Layers 
} from 'lucide-react';
import { ViewState } from '../types';

interface AboutViewProps {
  onNavigate: (view: ViewState) => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div id="about-page-container" className="space-y-12 max-w-4xl mx-auto py-4">
      {/* Brand Hero */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 mx-auto shadow-xl shadow-cyan-950/40">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
            <Smartphone className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Independent Android Engineering
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Siraj Ahmed Tech
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Pioneering clean, standalone Android applications with direct APK distribution, zero telemetry trackers, and hardware-accelerated local performance.
          </p>
        </div>
      </div>

      {/* Core Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/80">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Pure Standalone APK Distribution
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Modern mobile app stores often mandate intrusive proprietary SDKs, ad-trackers, and complex background analytics. Siraj Ahmed Tech distributes pure, self-contained APKs directly to users with verifiable SHA-256 signatures.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-800/80">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Privacy-First &amp; Zero Tracking
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every application is architected around local-first storage (SQLite/Keystore) with zero remote analytics telemetry. Your device and your data remain sovereign at all times.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/80">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Native Android Performance
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Leveraging modern Android architecture components, Kotlin coroutines, and native C++ DSP pipelines to deliver instant boot times, low memory footprints, and negligible battery drain.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800/80">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Transparent Manifests &amp; Permissions
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We list exact package identifiers, min/target SDK versions, required OS permissions, and complete changelogs for every published release.
          </p>
        </div>
      </div>

      {/* Developer Profile Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Software Architect &amp; Maintainer
            </span>
            <h2 className="text-2xl font-bold text-white">
              Siraj Ahmed
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Independent Android Developer &amp; Systems Engineer
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('apps')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            Explore Releases
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-mono text-[11px]">Primary Focus</span>
            <p className="font-semibold text-slate-200">Android Security &amp; Native Utilities</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-mono text-[11px]">Architecture</span>
            <p className="font-semibold text-slate-200">Kotlin, C++ NDK, Jetpack Compose</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-mono text-[11px]">Distribution Hub</span>
            <p className="font-semibold text-cyan-400 font-mono">sirajahmedtech.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
