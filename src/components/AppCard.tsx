import React, { useState } from 'react';
import { Download, ArrowRight, Globe } from 'lucide-react';
import { Application } from '../types';
import { RatingStars } from './RatingStars';
import { LikeHeart } from './LikeHeart';

interface AppCardProps {
  key?: React.Key;
  app: Application;
  onSelect: (app: Application) => void;
  onDownload: (app: Application) => void;
  onRateApp?: (appId: string, rating: number) => void;
  onLikeApp?: (appId: string, newTotal: number) => void;
}

export function AppCard({
  app,
  onSelect,
  onDownload,
  onRateApp,
  onLikeApp,
}: AppCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    onDownload(app);
    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  };

  const webAppUrl = app.webAppUrl?.trim();
  const hasValidWebAppUrl = Boolean(webAppUrl) && (() => {
    try {
      const url = new URL(webAppUrl as string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  })();

  const handleWebAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasValidWebAppUrl && webAppUrl) {
      window.open(webAppUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      id={`app-card-${app.id}`}
      onClick={() => onSelect(app)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative w-13 h-13 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
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

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700">
                  {app.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  v{app.version}
                </span>
              </div>
              <h3 className="font-bold text-white text-base mt-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {app.name}
              </h3>
            </div>
          </div>

          <LikeHeart
            appId={app.id}
            likes={app.likes || 0}
            size="sm"
            onToggleLike={(newTotal) => onLikeApp && onLikeApp(app.id, newTotal)}
          />
        </div>

        {/* Short Description */}
        {app.shortDescription && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {app.shortDescription}
          </p>
        )}

        {/* Package & Compatibility Specs */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850/80 text-[11px] font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Package:</span>
            <span className="text-slate-300 truncate max-w-[170px]" title={app.packageName}>
              {app.packageName}
            </span>
          </div>
          {app.minAndroid && (
            <div className="flex items-center justify-between text-slate-400">
              <span>Compatibility:</span>
              <span className="text-emerald-400">{app.minAndroid}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <RatingStars
            appId={app.id}
            average={app.ratingAverage || 0}
            count={app.ratingCount || 0}
            size="sm"
            onRate={(val) => onRateApp && onRateApp(app.id, val)}
          />

          <div className="text-[11px] font-mono text-slate-400">
            <span className="font-bold text-white">{(app.downloads || 0).toLocaleString()}</span> dl
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id={`btn-download-${app.id}`}
            onClick={handleDownloadClick}
            className="flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-md shadow-cyan-950/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'Starting...' : `Download for Android ${app.apkSizeFormatted ? `(${app.apkSizeFormatted})` : ''}`}</span>
          </button>

          {hasValidWebAppUrl && (
            <button
              type="button"
              onClick={handleWebAppClick}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              aria-label={`Use ${app.name} on iOS or Windows`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Use on iOS / Windows</span>
              <span className="sm:hidden">PWA</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelect(app)}
            aria-label="View app details"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
