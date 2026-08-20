import { testFirebaseConnection } from "./firebaseTest";
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Cpu, 
  Sparkles, 
  Layers, 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  Plus, 
  Terminal
} from 'lucide-react';
import { Application, ViewState, AppSortOption, AdminUser } from './types';
import { addDoc, collection, deleteDoc, doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { getCurrentAdmin, isAdminEmail, signOutAdmin, subscribeToAdminAuth } from './utils/auth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppCard } from './components/AppCard';
import { AppDetailModal } from './components/AppDetailModal';
import { DownloadToast } from './components/DownloadToast';
import { AdminHub } from './components/AdminHub';
import { AppFormModal } from './components/AppFormModal';
import { AboutView } from './components/AboutView';
import { AdminAuthModal } from './components/AdminAuthModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

export default function App() {
  const getViewFromHash = (hash: string): ViewState | null => {
    const normalizedHash = hash.replace(/^#/, '').trim();

    if (!normalizedHash || normalizedHash === 'admin-login') {
      return null;
    }

    if (['home', 'apps', 'about', 'admin'].includes(normalizedHash)) {
      return normalizedHash as ViewState;
    }

    return null;
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const [view, setView] = useState<ViewState>(() => {
    try {
      if (window.location.pathname.replace(/\/$/, '') === '/admin') {
        return 'admin';
      }
      const hash = window.location.hash.replace('#', '');
      return getViewFromHash(hash) ?? 'home';
    } catch {
      // Fallback
    }
    return 'home';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getCurrentAdmin());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((user) => {
      setAdminUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const applicationsRef = collection(db, 'applications');

    const unsubscribe = onSnapshot(
      applicationsRef,
      (snapshot) => {
        const loadedApps = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Application[];

        setApps(loadedApps);
        setFirebaseLoading(false);
        setFirebaseError(null);
      },
      (error) => {
        console.error('Firestore applications listener failed:', error);
        setFirebaseError('Unable to load applications from the repository.');
        setFirebaseLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<AppSortOption>('latest');

  // Modal states
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [downloadingApp, setDownloadingApp] = useState<Application | null>(null);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync view state with browser navigation / hash.
  // A private '#admin-login' hash is treated as a modal trigger, not a public view.
  useEffect(() => {
    const handleLocationChange = () => {
      try {
        const pathname = window.location.pathname.replace(/\/$/, '');
        const hash = window.location.hash.replace('#', '');

        if (pathname === '/admin') {
          if (!getCurrentAdmin()) {
            setIsAuthModalOpen(true);
            setView('home');
            return;
          }

          setView('admin');
          return;
        }

        if (hash === 'admin') {
          if (!getCurrentAdmin()) {
            window.location.hash = 'admin-login';
            setIsAuthModalOpen(true);
            setView('home');
            return;
          }

          setView('admin');
          return;
        }

        if (hash === 'admin-login') {
          setIsAuthModalOpen(true);
          setView('home');
          return;
        }

        const nextView = getViewFromHash(hash);
        if (nextView) {
          setView(nextView);
          return;
        }

        if (!hash) {
          setView('home');
        }
      } catch (err) {
        console.warn('Location change error:', err);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (view === 'admin' && !adminUser) {
      setIsAuthModalOpen(true);
      try {
        window.location.hash = 'admin-login';
      } catch (err) {
        console.warn('Could not redirect unauthenticated admin route:', err);
      }
      setView('home');
    }
  }, [view, adminUser]);

  const navigateTo = (v: ViewState) => {
    if (v === 'admin' && !adminUser) {
      setIsAuthModalOpen(true);
      try {
        window.history.pushState(null, '', '/admin');
      } catch (e) {
        console.warn('Could not redirect to admin login:', e);
      }
      setView('home');
      return;
    }

    setView(v);
    try {
      if (v === 'admin') {
        window.history.replaceState(null, '', '/admin');
      } else {
        window.location.hash = v;
      }
    } catch (e) {
      console.warn('Could not update hash:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setIsAuthModalOpen(false);
    navigateTo('admin');
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);

    if (window.location.hash === '#admin-login' || window.location.pathname.replace(/\/$/, '') === '/admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      if (window.location.pathname.replace(/\/$/, '') === '/admin') {
        window.history.replaceState(null, '', '/');
      }
      setView('home');
    }
  };

  const handleSignOut = () => {
    void signOutAdmin();
    setAdminUser(null);
    if (view === 'admin') {
      navigateTo('home');
    }
  };

  // Categories list
  const categories = ['All', ...Array.from(new Set(apps.map((a) => a.category)))];

  // Filtered & Sorted Apps for Public View
  const publishedApps = apps.filter((a) => a.published);

  const filteredApps = publishedApps.filter((app) => {
    const matchSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortOption === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    if (sortOption === 'rating') return (b.ratingAverage || 0) - (a.ratingAverage || 0);
    if (sortOption === 'likes') return (b.likes || 0) - (a.likes || 0);
    return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
  });

  // Action Handlers
  const handleDownload = async (app: Application) => {
    setDownloadingApp(app);

    try {
      await updateDoc(doc(db, 'applications', app.id), {
        downloads: increment(1),
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Unable to sync APK download count to Firestore:', error);
    }

    if (selectedApp && selectedApp.id === app.id) {
      setSelectedApp({ ...selectedApp, downloads: (selectedApp.downloads || 0) + 1 });
    }

    if (app.apkUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.href = app.apkUrl;
      downloadLink.download = app.apkFileName || 'app-release.apk';
      downloadLink.target = '_blank';
      downloadLink.rel = 'noopener noreferrer';

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleRateApp = async (appId: string, rating: number) => {
    const app = apps.find((item) => item.id === appId);
    if (!app) return;

    const currentCount = app.ratingCount || 0;
    const currentAvg = app.ratingAverage || 0;
    const newCount = currentCount + 1;
    const newAvg = Number(((currentAvg * currentCount + rating) / newCount).toFixed(1));

    try {
      await updateDoc(doc(db, 'applications', appId), {
        ratingAverage: newAvg,
        ratingCount: newCount,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Unable to sync rating to Firestore:', error);
    }
  };

  const handleLikeApp = async (appId: string, newTotal: number) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        likes: newTotal,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Unable to sync like count to Firestore:', error);
    }
  };

  const handleTogglePublish = async (appId: string) => {
    const app = apps.find((item) => item.id === appId);
    if (!app) return;

    try {
      await updateDoc(doc(db, 'applications', appId), {
        published: !app.published,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Unable to update publish state in Firestore:', error);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    try {
      await deleteDoc(doc(db, 'applications', appId));
    } catch (error) {
      console.error('Unable to delete application from Firestore:', error);
    }

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(null);
    }
  };

  const handleSaveApp = async (appData: Partial<Application>) => {
    if (editingApp) {
      const appPayload = {
        ...appData,
        updatedAt: Date.now(),
      };

      try {
        await updateDoc(doc(db, 'applications', editingApp.id), appPayload);
      } catch (error) {
        console.error('Unable to update application in Firestore:', error);
      }
    } else {
      const newApp = {
        id: '',
        name: appData.name || 'New Application',
        slug: appData.slug || 'new-app',
        category: appData.category || 'Utilities',
        version: appData.version || '1.0.0',
        packageName: appData.packageName || 'com.sirajahmedtech.app',
        minAndroid: appData.minAndroid || 'Android 8.0 (API 26)',
        targetAndroid: appData.targetAndroid || 'Android 14 (API 34)',
        sha256Checksum: appData.sha256Checksum || '',
        shortDescription: appData.shortDescription || '',
        fullDescription: appData.fullDescription || '',
        features: appData.features || [],
        iconUrl: appData.iconUrl || 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&auto=format&fit=crop&q=80',
        apkUrl: appData.apkUrl || '',
        webAppUrl: appData.webAppUrl || '',
        apkSizeFormatted: appData.apkSizeFormatted || 'N/A',
        apkFileName: appData.apkFileName || `${(appData.name || 'app').replace(/\s+/g, '')}_v${appData.version || '1.0.0'}.apk`,
        screenshots: appData.screenshots || [],
        published: appData.published !== false,
        downloads: 0,
        likes: 0,
        ratingAverage: 0,
        ratingCount: 0,
        changelog: appData.changelog || 'v1.0.0: Initial release.',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      try {
        const docRef = await addDoc(collection(db, 'applications'), newApp);
        await updateDoc(doc(db, 'applications', docRef.id), { id: docRef.id });
      } catch (error) {
        console.error('Unable to create application in Firestore:', error);
      }
    }

    setIsFormOpen(false);
    setEditingApp(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <PwaInstallPrompt />

      {firebaseError && (
        <div className="mx-auto mt-4 w-full max-w-5xl rounded-2xl border border-rose-800/80 bg-rose-950/50 px-4 py-3 text-xs text-rose-200">
          {firebaseError}
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentView={view}
        onNavigate={(v) => navigateTo(v)}
        appsCount={publishedApps.length}
      />

      {firebaseLoading && (
        <div className="mx-auto w-full max-w-5xl px-4 pt-4 text-xs text-slate-400">
          Loading applications from Firebase…
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            {/* Hero Banner */}
            <section id="hero-banner" className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-12 lg:p-16 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
              
              <div className="relative max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Direct Android APK Distribution</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                  Independent Android Applications &amp; Software.
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  Siraj Ahmed Tech delivers standalone, optimized Android applications directly. Browse verified software releases, inspect package manifests and SHA-256 checksums, and download official APKs without third-party bloat.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    id="hero-explore-btn"
                    onClick={() => navigateTo('apps')}
                    className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-950/30 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Explore Applications</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <button
                    type="button"
                    id="hero-about-btn"
                    onClick={() => navigateTo('about')}
                    className="px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                  >
                    About Repository
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                      Direct APK Distribution
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct standalone binary downloads straight from the developer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                      Fast &amp; Unbloated
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Streamlined codebases with zero tracking or unnecessary permissions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                      ARM64 &amp; x86_64
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Targeted native architecture builds supporting modern Android devices.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Applications Section */}
            <section id="featured-apps-section" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    <Smartphone className="w-4 h-4" />
                    <span>Official Releases</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Featured Android Apps
                  </h2>
                </div>

                <button
                  type="button"
                  id="view-all-apps-link"
                  onClick={() => navigateTo('apps')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>Browse complete catalog ({publishedApps.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {publishedApps.length === 0 ? (
                <div className="py-16 text-center space-y-3 rounded-3xl bg-slate-900/60 border border-slate-800 p-8">
                  <Smartphone className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="font-bold text-base text-white">No applications published yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    New official APK releases will appear here once uploaded to the repository.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedApps.slice(0, 6).map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onSelect={(selected) => setSelectedApp(selected)}
                      onDownload={(target) => handleDownload(target)}
                      onRateApp={handleRateApp}
                      onLikeApp={handleLikeApp}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW: ALL APPS CATALOG */}
        {view === 'apps' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Catalog Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Verified Packages</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  All Applications Catalog
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Explore standalone Android APK installations directly developed and maintained by Siraj Ahmed.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  id="catalog-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search apps, package IDs, tags..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Pills & Sorting */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">Sort:</span>
                <select
                  id="catalog-sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as AppSortOption)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono cursor-pointer"
                >
                  <option value="latest">Latest Release</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="rating">Top Rated</option>
                  <option value="likes">Most Liked</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {sortedApps.length === 0 ? (
              <div className="py-16 text-center space-y-3 rounded-3xl bg-slate-900/60 border border-slate-800 p-8">
                <Smartphone className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="font-bold text-base text-white">
                  {publishedApps.length === 0 ? 'No applications in repository yet' : 'No applications found'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {publishedApps.length === 0
                    ? 'New official APK releases will appear in this catalog once uploaded.'
                    : `No APK packages match "${searchQuery}". Try adjusting your search or category filters.`}
                </p>
                {publishedApps.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedApps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    onSelect={(selected) => setSelectedApp(selected)}
                    onDownload={(target) => handleDownload(target)}
                    onRateApp={handleRateApp}
                    onLikeApp={handleLikeApp}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: ABOUT */}
        {view === 'about' && (
          <div className="animate-in fade-in duration-300">
            <AboutView onNavigate={(v) => navigateTo(v)} />
          </div>
        )}

        {/* VIEW: ADMIN */}
        {view === 'admin' && (
          <div className="animate-in fade-in duration-300">
            <AdminHub
              apps={apps}
              adminUser={adminUser}
              onAddApp={() => {
                setEditingApp(null);
                setIsFormOpen(true);
              }}
              onEditApp={(app) => {
                setEditingApp(app);
                setIsFormOpen(true);
              }}
              onTogglePublish={handleTogglePublish}
              onDeleteApp={handleDeleteApp}
              onSelectApp={(app) => setSelectedApp(app)}
              onSignOut={handleSignOut}
              onOpenAuthModal={() => {
                if (!adminUser) {
                  setIsAuthModalOpen(true);
                }
              }}
            />
          </div>
        )}
      </main>

      {/* App Detail Modal */}
      <AppDetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onDownload={handleDownload}
        onRateApp={handleRateApp}
        onLikeApp={handleLikeApp}
      />

      {/* App Form Modal (Add / Edit) */}
      <AppFormModal
        app={editingApp}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onSuccess={handleSignInSuccess}
      />

      {/* Animated Download Toast */}
      <DownloadToast
        app={downloadingApp}
        onClose={() => setDownloadingApp(null)}
      />

      {/* Footer */}
      <Footer 
        onNavigate={(v) => navigateTo(v)}
      />
    </div>
  );
}
