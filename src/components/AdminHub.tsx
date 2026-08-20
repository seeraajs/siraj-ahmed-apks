import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Download, 
  ShieldCheck, 
  Layers, 
  Heart, 
  Search, 
  Smartphone, 
  AlertTriangle,
  X,
  LogOut,
  Lock,
  UserCheck
} from 'lucide-react';
import { Application, AdminUser } from '../types';

interface AdminHubProps {
  apps: Application[];
  adminUser: AdminUser | null;
  onAddApp: () => void;
  onEditApp: (app: Application) => void;
  onTogglePublish: (appId: string) => void;
  onDeleteApp: (appId: string) => void;
  onSelectApp: (app: Application) => void;
  onSignOut: () => void;
  onOpenAuthModal: () => void;
}

export function AdminHub({
  apps,
  adminUser,
  onAddApp,
  onEditApp,
  onTogglePublish,
  onDeleteApp,
  onSelectApp,
  onSignOut,
  onOpenAuthModal,
}: AdminHubProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);

  // If user is not authenticated as admin, show access restricted prompt
  if (!adminUser) {
    return (
      <div className="py-16 text-center space-y-6 max-w-lg mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">Administrator Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The developer console and APK management portal are restricted to authorized administrators. Please sign in with your authorized administrator credentials to proceed.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAuthModal}
          className="w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-950/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sign In with Authorized Account</span>
        </button>
      </div>
    );
  }

  const totalDownloads = apps.reduce((acc, a) => acc + (a.downloads || 0), 0);
  const totalLikes = apps.reduce((acc, a) => acc + (a.likes || 0), 0);
  const publishedCount = apps.filter((a) => a.published).length;
  const draftCount = apps.length - publishedCount;

  const categories = ['All', ...Array.from(new Set(apps.map((a) => a.category)))];

  const filteredApps = apps.filter((app) => {
    const matchSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.packageName.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || app.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const confirmDelete = () => {
    if (appToDelete) {
      onDeleteApp(appToDelete.id);
      setAppToDelete(null);
    }
  };

  return (
    <div id="admin-hub-container" className="space-y-8 animate-in fade-in duration-200">
      {/* Admin Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Developer Management Console</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-300 font-normal lowercase">{adminUser.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Repository Management Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Android package metadata, publish release updates, and configure download channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            id="admin-signout-btn"
            onClick={onSignOut}
            className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-900 hover:bg-rose-950 hover:text-rose-300 border border-slate-800 hover:border-rose-800/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            title="Exit portal and sign out of admin session"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Exit Portal / Sign Out</span>
          </button>

          <button
            type="button"
            id="admin-add-app-btn"
            onClick={onAddApp}
            className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-950/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New APK Package</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Real metrics only) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Total Packages</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{apps.length}</p>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400">{publishedCount} live</span>
            <span>&bull;</span>
            <span className="text-amber-400">{draftCount} draft</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Total APK Downloads</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{totalDownloads.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Actual downloads recorded</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Total App Likes</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{totalLikes.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">User ratings and likes</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Security Status</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">100% Verified</p>
          <p className="text-[11px] text-slate-400">Direct standalone APK packages</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="admin-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search package name, title, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Application</th>
                <th className="py-3.5 px-4 font-semibold">Package Identifier</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Version</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Downloads</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Smartphone className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">No applications match your filter</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {apps.length === 0
                        ? 'Get started by publishing your first Android APK release.'
                        : 'Try searching with a different keyword or category.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-850/50 transition-colors group">
                    {/* App Name & Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                          {app.iconUrl ? (
                            <img
                              src={app.iconUrl}
                              alt={app.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Smartphone className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            <span>{app.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{app.shortDescription}</p>
                        </div>
                      </div>
                    </td>

                    {/* Package Identifier */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                      {app.packageName}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
                        {app.category}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      v{app.version}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onTogglePublish(app.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                          app.published
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/80 hover:bg-amber-900'
                        }`}
                        title={app.published ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {app.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{app.published ? 'Live' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Downloads */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {(app.downloads || 0).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectApp(app)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                          title="Preview public app modal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditApp(app)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors cursor-pointer"
                          title="Edit package details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setAppToDelete(app)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors cursor-pointer"
                          title="Delete application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-App Delete Confirmation Modal */}
      {appToDelete && (
        <div
          id="delete-app-modal-backdrop"
          onClick={() => setAppToDelete(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            id="delete-app-modal"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900 border border-rose-900/60 rounded-3xl p-6 shadow-2xl space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Delete Application?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-white font-mono">{appToDelete.name}</strong> (
                {appToDelete.packageName})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-950/50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
