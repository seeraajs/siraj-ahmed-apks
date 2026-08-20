import React from 'react';
import { Download, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Application } from '../types';

interface DownloadToastProps {
  app: Application | null;
  onClose: () => void;
}

export function DownloadToast({ app, onClose }: DownloadToastProps) {
  if (!app) return null;

  return (
    <div
      id="download-notification-toast"
      className="fixed bottom-5 right-5 z-50 max-w-md w-full bg-slate-900 border-2 border-cyan-500/80 rounded-2xl p-4 shadow-2xl shadow-cyan-950/40 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-800">
            <Download className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <span>Downloading Official APK</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-300 font-mono font-medium">
              {app.apkFileName} ({app.apkSizeFormatted})
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              Direct download started. When finished, open the file on your Android device to install.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" /> Checksum Verified
        </span>
        <span className="truncate max-w-[180px]">
          {app.packageName}
        </span>
      </div>
    </div>
  );
}
