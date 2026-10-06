import React from 'react';
import {
  ShieldCheck,
  Database,
  UserCog,
  Download,
  Star,
  Heart,
  Lock,
  Globe2,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { ViewState } from '../types';

interface PrivacyPolicyViewProps {
  onNavigate: (view: ViewState) => void;
}

export function PrivacyPolicyView({ onNavigate }: PrivacyPolicyViewProps) {
  return (
    <div id="privacy-policy-page" className="space-y-10 max-w-4xl mx-auto py-4">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 mx-auto shadow-xl shadow-cyan-950/40">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Privacy &amp; Data
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            This Privacy Policy explains how Siraj Ahmed Tech handles information
            when you visit this website and use its application distribution features.
          </p>

          <p className="text-[11px] text-slate-500 font-mono">
            Last updated: October 2026
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <Globe2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            1. About This Policy
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Siraj Ahmed Tech is an independent software distribution website operated
          by Siraj Ahmed. The website provides information about applications and,
          where available, direct APK downloads and links to web applications.
        </p>

        <p className="text-sm text-slate-300 leading-relaxed">
          We aim to collect and use only the information reasonably necessary to
          operate the website, maintain application records, provide application
          features, and protect the administration area.
        </p>
      </section>

      {/* Information handled */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            2. Information We Handle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">
              Application Data
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Published application records may contain information such as the
              application name, version, package name, descriptions, features,
              APK information, screenshots, download information, ratings,
              likes, changelogs, and web application links.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">
              Public Interactions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The website may record application download counts, ratings,
              rating counts, and likes in order to provide and display
              application statistics.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">
              Administrator Information
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The private administration area uses Firebase Authentication.
              Authorized administrator account information may be processed
              for authentication, access control, and administration of
              application records.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">
              Browser Storage
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The website may use browser local storage for application
              preferences, installation-related state, and administrator
              session information. Browser storage remains on the user's
              device unless the browser or user removes it.
            </p>
          </div>

        </div>
      </section>

      {/* Firebase */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">
            3. Firebase Services
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Siraj Ahmed Tech uses Google Firebase services for selected website
          functions, including Firebase Authentication and Cloud Firestore.
          Firestore is used to store and retrieve application catalogue data
          and related application statistics.
        </p>

        <p className="text-sm text-slate-300 leading-relaxed">
          Firebase services are provided by Google and may process information
          according to Google's applicable terms and privacy practices.
        </p>
      </section>

      {/* Downloads */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            4. APK Downloads &amp; External Applications
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          APK files and web applications may be hosted or provided through
          external services. When you follow an external application link or
          download an APK, you may be interacting with a different service
          that has its own privacy policy and terms.
        </p>

        <p className="text-sm text-slate-300 leading-relaxed">
          Users should review the privacy and security practices of any
          external service before providing personal information or installing
          software.
        </p>
      </section>

      {/* Ratings and likes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <Star className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            Ratings
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Application ratings and rating totals may be stored so that
            aggregate ratings can be displayed on the website.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <Heart className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">
            Likes
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Application like totals may be stored to provide the website's
            like and popularity features.
          </p>
        </div>

      </section>

      {/* Security */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            5. Security
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          We take reasonable measures to protect the website and its
          administration functions. However, no internet transmission,
          website, or storage system can be guaranteed to be completely
          secure.
        </p>

        <p className="text-sm text-slate-300 leading-relaxed">
          Users should keep their own devices, browsers, operating systems,
          and installed applications up to date and use appropriate security
          practices.
        </p>
      </section>

      {/* Children's privacy */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">
          6. Children's Privacy
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          The website is not specifically directed at children. We do not
          knowingly request personal information from children through the
          website.
        </p>
      </section>

      {/* Changes */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">
          7. Changes to This Policy
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          This Privacy Policy may be updated when website functionality,
          application services, legal requirements, or data practices change.
          The updated version will be published on this page with a revised
          update date.
        </p>
      </section>

      {/* Contact */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            8. Contact
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          If you have questions about this Privacy Policy or the handling of
          information on Siraj Ahmed Tech, please contact the site operator
          through the contact information provided on the Contact page.
        </p>
      </section>

      {/* Back */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Siraj Ahmed Tech
        </button>
      </div>

    </div>
  );
}
