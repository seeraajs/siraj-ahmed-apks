import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Smartphone, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  Wand2,
  Check,
  Info
} from 'lucide-react';
import { Application, AppFeature, AppScreenshot } from '../types';
import { generateDescriptionAndFeatures } from '../utils/textGenerator';

interface AppFormModalProps {
  app: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Partial<Application>) => void;
}

export const APP_CATEGORIES = [
  'Utilities',
  'Education',
  'Lifestyle',
  'Sports',
  'Productivity',
  'Security',
  'Entertainment',
  'Games',
  'Health & Fitness',
  'Developer Tools',
  'Media',
  'Finance',
  'Communication',
  'System',
  'Other',
];

const NEW_APP_DRAFT_KEY = 'sat_app_new_draft_v1';

export function AppFormModal({
  app,
  isOpen,
  onClose,
  onSave,
}: AppFormModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [version, setVersion] = useState('1.0.0');
  const [packageName, setPackageName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [apkUrl, setApkUrl] = useState('');
  const [webAppUrl, setWebAppUrl] = useState('');
  const [apkFileName, setApkFileName] = useState('');
  const [apkSizeFormatted, setApkSizeFormatted] = useState('');
  const [published, setPublished] = useState(true);
  const [features, setFeatures] = useState<AppFeature[]>([]);
  const [screenshots, setScreenshots] = useState<AppScreenshot[]>([]);

  // Draft feedback & Auto-generate feedback
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [aiGeneratedFeedback, setAiGeneratedFeedback] = useState<string | null>(null);

  // Device file upload state
  const [apkSourceType, setApkSourceType] = useState<'upload' | 'url'>('upload');
  const [isDraggingApk, setIsDraggingApk] = useState(false);
  const apkFileInputRef = useRef<HTMLInputElement>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);

  // Load initial state or restore draft
  useEffect(() => {
    if (!isOpen) return;

    if (app) {
      // Editing existing app
      setName(app.name || '');
      setSlug(app.slug || '');
      setCategory(app.category || 'Utilities');
      setVersion(app.version || '1.0.0');
      setPackageName(app.packageName || '');
      setShortDescription(app.shortDescription || '');
      setFullDescription(app.fullDescription || '');
      setIconUrl(app.iconUrl || '');
      setApkUrl(app.apkUrl || '');
      setWebAppUrl(app.webAppUrl || '');
      setApkSizeFormatted(app.apkSizeFormatted || '');
      setApkFileName(app.apkFileName || '');
      setPublished(app.published !== false);
      setFeatures(app.features || []);
      setScreenshots(app.screenshots || []);
      setApkSourceType(app.apkUrl?.startsWith('blob:') || !app.apkUrl ? 'upload' : 'url');
      setHasRestoredDraft(false);
    } else {
      // Creating a new app -> Check if an unsubmitted draft was saved
      try {
        const savedDraft = localStorage.getItem(NEW_APP_DRAFT_KEY);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          if (draft && (draft.name || draft.shortDescription || draft.packageName || draft.apkUrl)) {
            setName(draft.name || '');
            setSlug(draft.slug || '');
            setCategory(draft.category || 'Utilities');
            setVersion(draft.version || '1.0.0');
            setPackageName(draft.packageName || '');
            setShortDescription(draft.shortDescription || '');
            setFullDescription(draft.fullDescription || '');
            setIconUrl(draft.iconUrl || '');
            setApkUrl(draft.apkUrl || '');
            setApkSizeFormatted(draft.apkSizeFormatted || '');
            setApkFileName(draft.apkFileName || '');
            setPublished(draft.published !== false);
            setFeatures(draft.features || []);
            setScreenshots(draft.screenshots || []);
            setApkSourceType(draft.apkSourceType || 'upload');
            setHasRestoredDraft(true);
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to read form draft:', e);
      }

      // If no draft exists, clean blank state
      resetFormToDefaults();
    }
  }, [app, isOpen]);

  // Auto-save unsubmitted draft when creating a new app
  useEffect(() => {
    if (!isOpen || app) return;

    // Only save if at least one meaningful field has been entered
    if (name || shortDescription || fullDescription || packageName || iconUrl || apkUrl || features.length > 0) {
      try {
        const draftData = {
          name,
          slug,
          category,
          version,
          packageName,
          shortDescription,
          fullDescription,
          iconUrl,
          apkUrl,
          apkFileName,
          apkSizeFormatted,
          published,
          features,
          screenshots,
          apkSourceType,
          savedAt: Date.now(),
        };
        localStorage.setItem(NEW_APP_DRAFT_KEY, JSON.stringify(draftData));
      } catch (e) {
        console.warn('Failed to save form draft:', e);
      }
    }
  }, [
    name,
    slug,
    category,
    version,
    packageName,
    shortDescription,
    fullDescription,
    iconUrl,
    apkUrl,
    apkFileName,
    apkSizeFormatted,
    published,
    features,
    screenshots,
    apkSourceType,
    isOpen,
    app
  ]);

  const resetFormToDefaults = () => {
    setName('');
    setSlug('');
    setCategory('Utilities');
    setVersion('1.0.0');
    setPackageName('');
    setShortDescription('');
    setFullDescription('');
    setIconUrl('');
    setApkUrl('');
    setApkSizeFormatted('');
    setApkFileName('');
    setPublished(true);
    setFeatures([]);
    setScreenshots([]);
    setApkSourceType('upload');
    setHasRestoredDraft(false);
  };

  const handleClearDraft = () => {
    localStorage.removeItem(NEW_APP_DRAFT_KEY);
    resetFormToDefaults();
  };

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!app) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (val.trim()) {
        if (!packageName || packageName.startsWith('com.sirajahmedtech.')) {
          setPackageName(`com.sirajahmedtech.${generatedSlug.replace(/-/g, '')}`);
        }
        if (!apkFileName) {
          setApkFileName(`${val.replace(/\s+/g, '')}_v${version || '1.0.0'}.apk`);
        }
      }
    }
  };

  // Smart Auto-Generator triggered by Short Summary Description
  const handleAutoGenerateContent = (customSummary?: string) => {
    const summaryToUse = (typeof customSummary === 'string' ? customSummary : shortDescription).trim();
    if (!summaryToUse) return;

    const generated = generateDescriptionAndFeatures(summaryToUse, name || 'This application', category);
    setFullDescription(generated.fullDescription);
    setFeatures(generated.features);

    setAiGeneratedFeedback(`Generated full description and ${generated.features.length} core features from keywords!`);
    setTimeout(() => {
      setAiGeneratedFeedback(null);
    }, 4000);
  };

  const handleShortDescriptionChange = (val: string) => {
    setShortDescription(val);
    // If full description and features are currently empty and user entered a meaningful summary, auto-populate them
    if (val.trim().length >= 10 && (!fullDescription.trim() || features.length === 0)) {
      const generated = generateDescriptionAndFeatures(val, name || 'This application', category);
      if (!fullDescription.trim()) {
        setFullDescription(generated.fullDescription);
      }
      if (features.length === 0) {
        setFeatures(generated.features);
      }
    }
  };

  // APK Device File Handler
  const processApkFile = (file: File) => {
    const sizeInMb = file.size / (1024 * 1024);
    const formattedSize = sizeInMb < 0.1 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${sizeInMb.toFixed(1)} MB`;

    setApkFileName(file.name);
    setApkSizeFormatted(formattedSize);
    
    // Create direct downloadable object URL
    // Do not create a temporary blob URL.
    // The public APK URL must come from the APK URL field.
  };

  const handleApkFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processApkFile(files[0]);
    }
  };

  const handleApkDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingApk(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processApkFile(e.dataTransfer.files[0]);
    }
  };

  // Icon Device File Handler
const handleIconFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;

  if (!files || files.length === 0) return;

  const file = files[0];

  // Icons are stored as public project assets.
  // Never convert the image to Base64 and store it in Firestore.
  if (!file.type.startsWith('image/')) {
    console.warn('Selected icon is not a valid image file.');
    return;
  }

  // The confirmed Siraj Resume Builder icon is deployed
  // from public/icons/siraj-resume-builder.png.
  setIconUrl('/icons/siraj-resume-builder.png');

  // Allow selecting the same file again later.
  e.target.value = '';
};

  const handleAddFeature = () => {
    setFeatures([...features, { id: 'f_' + Date.now(), title: '', description: '' }]);
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const handleUpdateFeature = (id: string, field: 'title' | 'description', val: string) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, [field]: val } : f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Clear saved draft on successful publish
    localStorage.removeItem(NEW_APP_DRAFT_KEY);

    onSave({
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      version: version.trim() || '1.0.0',
      packageName: packageName.trim() || `com.sirajahmedtech.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      iconUrl: iconUrl.trim() || '/icons/siraj-resume-builder.png',
      apkUrl: apkUrl.trim(),
      webAppUrl: webAppUrl.trim(),
      apkSizeFormatted: apkSizeFormatted || 'N/A',
      apkFileName: apkFileName.trim() || `${name.replace(/\s+/g, '')}_v${version}.apk`,
      published,
      features: features.filter((f) => f.title.trim().length > 0),
      screenshots,
    });
  };

  return (
    <div
      id="app-form-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="app-form-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">
                {app ? `Edit Release: ${app.name}` : 'Publish New Android APK Package'}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {app ? `Package: ${app.packageName}` : 'Inputs are auto-saved in your workspace'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!app && hasRestoredDraft && (
              <button
                type="button"
                onClick={handleClearDraft}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear restored draft and start fresh"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Draft</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Draft Notice Banner */}
        {!app && hasRestoredDraft && (
          <div className="bg-cyan-950/40 border-b border-cyan-800/40 px-6 py-2 flex items-center justify-between gap-3 text-xs text-cyan-300">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Unsubmitted draft restored — your typed details have been preserved!</span>
            </div>
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-[11px] text-slate-400 hover:text-rose-300 underline font-mono cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* App Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Application Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Offline Calculator Pro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Package Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Android Package Identifier (packageName) *
              </label>
              <input
                type="text"
                required
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="com.sirajahmedtech.calculator"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-500 cursor-pointer"
              >
                {APP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Version */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Release Version (e.g. 1.0.0)
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Device APK File Upload Section */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  Android APK Package File
                </label>
                <p className="text-[11px] text-slate-400">
                  Upload an .apk file directly from your device or provide a download URL.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setApkSourceType('upload')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    apkSourceType === 'upload'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Browse Device
                </button>
                <button
                  type="button"
                  onClick={() => setApkSourceType('url')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    apkSourceType === 'url'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Remote URL
                </button>
              </div>
            </div>

            {apkSourceType === 'upload' ? (
              <div className="space-y-3 pt-2">
                {/* Hidden input for file picker */}
                <input
                  ref={apkFileInputRef}
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  onChange={handleApkFileInputChange}
                  className="hidden"
                  id="apk-file-picker"
                />

                {apkFileName && apkUrl ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-cyan-800/60 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white font-mono">{apkFileName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Size: {apkSizeFormatted || 'Detected from file'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => apkFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 transition-colors cursor-pointer"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingApk(true);
                    }}
                    onDragLeave={() => setIsDraggingApk(false)}
                    onDrop={handleApkDrop}
                    onClick={() => apkFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      isDraggingApk
                        ? 'border-cyan-400 bg-cyan-950/20'
                        : 'border-slate-800 hover:border-cyan-500/60 bg-slate-900/50 hover:bg-slate-900'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-white">
                      Click to Browse APK from Device or Drag &amp; Drop
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      Accepts .apk Android application packages
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 pt-2">
                <input
                  type="url"
                  value={apkUrl}
                  onChange={(e) => {
  const url = e.target.value.trim();
  setApkUrl(url);

  if (url) {
    try {
      const pathname = new URL(url).pathname;
      const filename = pathname.split('/').pop();

      if (filename && filename.toLowerCase().endsWith('.apk')) {
        setApkFileName(decodeURIComponent(filename));
      }
    } catch {
      // Ignore invalid/incomplete URLs while typing
    }
  }
}}
                  placeholder="https://example.com/downloads/app.apk"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>
            )}
          </div>
	{/* Web App / PWA URL */}
<div className="space-y-3">
  <div>
    <label className="block text-sm font-semibold text-slate-200 mb-1.5">
      Web App / PWA URL
    </label>
    <p className="text-xs text-slate-400 mb-2">
      Optional. Add the web address users can open on iPhone, iPad, Windows,
      Mac, or other devices.
    </p>

    <input
      type="url"
      value={webAppUrl}
      onChange={(e) => setWebAppUrl(e.target.value)}
      placeholder="https://your-app.example.com"
      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60"
    />

    {webAppUrl.trim() && (
      <div className="mt-2 text-xs text-emerald-400">
        ✓ Web App URL added
      </div>
    )}
  </div>
</div>
          {/* App Icon Upload / URL */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <label className="block text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Application Icon
            </label>
            
            <input
              ref={iconFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconFileInputChange}
              className="hidden"
              id="icon-file-picker"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon Preview */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center shadow-md">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt="App icon preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => iconFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Browse Icon from Device</span>
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono">or enter URL</span>
                </div>

                <input
                  type="text"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="/icons/app-icon.png or https://example.com/icon.png"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Short Description with Auto-generation */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-mono font-medium text-slate-200">
                Short Summary Description *
              </label>
              {shortDescription.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => handleAutoGenerateContent()}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Auto-Generate Full Details</span>
                </button>
              )}
            </div>

            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => handleShortDescriptionChange(e.target.value)}
              onBlur={() => {
                if (shortDescription.trim() && (!fullDescription.trim() || features.length === 0)) {
                  handleAutoGenerateContent();
                }
              }}
              placeholder="e.g. Fast offline scientific calculator for math students and engineers with formula history"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
              <span>Type your summary keywords to automatically build the full description &amp; feature list.</span>
            </div>

            {aiGeneratedFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{aiGeneratedFeedback}</span>
              </div>
            )}
          </div>

          {/* Full Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Full Application Description
              </label>
              {shortDescription.trim() && (
                <button
                  type="button"
                  onClick={() => handleAutoGenerateContent()}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" /> Regenerate from summary
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed description, architecture, and capabilities..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-500 leading-relaxed"
            />
          </div>

          {/* Features Editor */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  Features ({features.length})
                </label>
                <p className="text-[11px] text-slate-400">
                  Key highlights derived from your summary keywords or added manually.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddFeature}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Feature
              </button>
            </div>

            {features.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                No custom features added. Type a short summary description above to auto-generate them!
              </p>
            ) : (
              <div className="space-y-2.5">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Feature Title (e.g. Offline Sync)"
                        value={feature.title}
                        onChange={(e) => handleUpdateFeature(feature.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-medium focus:outline-hidden focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Feature Description"
                        value={feature.description || ''}
                        onChange={(e) => handleUpdateFeature(feature.id, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publish Switch */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Live Public Release</p>
              <p className="text-[11px] text-slate-400">Make this application immediately visible in the public APK catalog.</p>
            </div>

            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                published ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-950/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{app ? 'Save Changes' : 'Publish Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

