import { useEffect, useState } from 'react';
import { Download, Share2, WifiOff, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'sat_pwa_install_dismissed';

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [showInstall, setShowInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const handleBeforeInstallPrompt = (event: Event) => {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window);
    setIsIos(iosDevice);
    setShowIosHelp(iosDevice && !sessionStorage.getItem(DISMISSED_KEY));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const dismissInstall = () => {
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    setShowInstall(false);
    setInstallEvent(null);
    setShowIosHelp(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setShowInstall(false);
    setInstallEvent(null);
  };

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-xl border border-amber-800/80 bg-slate-900 px-3 py-2 text-xs font-medium text-amber-300 shadow-xl shadow-slate-950/40">
          <WifiOff className="h-4 w-4" />
          Offline mode: cached pages remain available
        </div>
      )}

      {showInstall && installEvent && (
        <div className="fixed bottom-5 left-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-cyan-800/80 bg-slate-900 p-3 text-slate-100 shadow-2xl shadow-slate-950/50">
          <Download className="h-5 w-5 shrink-0 text-cyan-400" />
          <p className="flex-1 text-xs leading-relaxed">Install Siraj Tech for quick access to the app hub.</p>
          <button type="button" onClick={install} className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950">Install</button>
          <button type="button" onClick={dismissInstall} aria-label="Dismiss install prompt" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isIos && !isOffline && !showInstall && showIosHelp && (
        <div className="fixed bottom-5 left-5 z-50 flex max-w-xs items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 shadow-xl shadow-slate-950/40">
          <Share2 className="h-4 w-4 shrink-0 text-cyan-400" />
          <span className="flex-1">Use Share, then Add to Home Screen to install.</span>
          <button type="button" onClick={dismissInstall} aria-label="Dismiss install instructions" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}