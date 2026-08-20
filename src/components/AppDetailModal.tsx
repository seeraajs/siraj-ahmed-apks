import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Calendar, 
  HardDrive, 
  FileCode, 
  ChevronRight
} from 'lucide-react';
import { Application } from '../types';
import { RatingStars } from './RatingStars';
import { LikeHeart } from './LikeHeart';

interface AppDetailModalProps {
  app: Application | null;
  onClose: () => void;
  onDownload: (app: Application) => void;
  onRateApp?: (appId: string, rating: number) => void;
  onLikeApp?: (appId: string, newTotal: number) => void;
}

export function AppDetailModal({
  app,
  onClose,
  onDownload,
  onRateApp,
  onLikeApp,
}: AppDetailModalProps) {
  const [copiedSha, setCopiedSha] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  if (!app) return null;

  const copyChecksum = () => {
    if (!app.sha256Checksum) return;
    navigator.clipboard.writeText(app.sha256Checksum);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(app.updatedAt || app.createdAt));

  return (
    <div
      id="app-detail-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="app-detail-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Repository</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-cyan-400">{app.category}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold truncate max-w-[200px]">{app.name}</span>
          </div>

          <button
            type="button"
            id="close-detail-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Main App Hero Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/80 shadow-xl flex-shrink-0">
                <img
                  src={app.iconUrl || 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&auto=format&fit=crop&q=80'}
                  alt={`${app.name} icon`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                    {app.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    v{app.version}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {app.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <RatingStars
                    appId={app.id}
                    average={app.ratingAverage || 0}
                    count={app.ratingCount || 0}
                    size="md"
                    onRate={(val) => onRateApp && onRateApp(app.id, val)}
                  />

                  <LikeHeart
                    appId={app.id}
                    likes={app.likes || 0}
                    size="md"
                    onToggleLike={(newTotal) => onLikeApp && onLikeApp(app.id, newTotal)}
                  />
                </div>
              </div>
            </div>

            {/* Direct Download Call to Action */}
            <div className="w-full sm:w-auto flex-shrink-0 flex flex-col gap-2">
              <button
                type="button"
                id="modal-direct-download-btn"
                onClick={() => onDownload(app)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-xl shadow-cyan-950/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download APK {app.apkSizeFormatted ? `(${app.apkSizeFormatted})` : ''}</span>
              </button>
                  {app.webAppUrl && (
  <button
    type="button"
    id="modal-open-web-app-btn"
    onClick={() => {
      window.open(app.webAppUrl, '_blank', 'noopener,noreferrer');
    }}
    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
  >
    <Smartphone className="w-4 h-4 text-cyan-400" />
    <span>Open Web App</span>
  </button>
)}
              <div className="text-center sm:text-right text-[11px] font-mono text-slate-400">
                {(app.downloads || 0).toLocaleString()} Downloads
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Package ID
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200 truncate" title={app.packageName}>
                {app.packageName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> OS Requirement
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200">
                {app.minAndroid || 'Android 8.0+'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Package Size
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200">
                {app.apkSizeFormatted || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Release Date
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Description */}
          {app.fullDescription && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Overview &amp; Architecture
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {app.fullDescription}
              </p>
            </div>
          )}

          {/* Feature Highlights */}
          {app.features && app.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Core Capabilities &amp; Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {app.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 border border-cyan-800/60">
                      ✓
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-white">
                        {feature.title}
                      </h4>
                      {feature.description && (
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshot Previews */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-cyan-400">
                App Screen Previews
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {app.screenshots.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    onClick={() => setActiveScreenshot(s.url)}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer group hover:border-cyan-500/80 transition-colors"
                  >
                    <img
                      src={s.url}
                      alt={s.caption || 'App screenshot'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {s.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/90 to-transparent text-[10px] font-mono text-slate-300 truncate">
                        {s.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Changelog */}
          {app.changelog && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Latest Release Notes
              </h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                {app.changelog}
              </p>
            </div>
          )}

          {/* SHA-256 Checksum Verification Box */}
          {app.sha256Checksum && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Package Checksum (SHA-256)
                </span>
                <button
                  type="button"
                  onClick={copyChecksum}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedSha ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Hash</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-400 break-all select-all border border-slate-850">
                {app.sha256Checksum}
              </div>
              <p className="text-[10px] text-slate-400">
                Verify this checksum after download using <code className="text-slate-300">sha256sum {app.apkFileName || 'app.apk'}</code> to ensure package integrity.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for screenshots */}
      {activeScreenshot && (
        <div
          onClick={() => setActiveScreenshot(null)}
          className="fixed inset-0 z-60 bg-slate-950/95 flex items-center justify-center p-4"
        >
          <img
            src={activeScreenshot}
            alt="Screenshot preview"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-slate-800 object-contain"
          />
        </div>
      )}
    </div>
  );
}
