import React from 'react';

interface ContactViewProps {
  onNavigate: (view: 'home' | 'apps' | 'about' | 'privacy' | 'terms' | 'contact' | 'admin') => void;
}

export function ContactView({ onNavigate }: ContactViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">
          Get in Touch
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Contact Siraj Ahmed Tech
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Questions, feedback, or application-related enquiries
        </p>
      </div>

      <div className="space-y-8 text-slate-300 leading-7">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            General Enquiries
          </h2>
          <p>
            If you have a question about Siraj Ahmed Tech, an application
            available on the website, a download, or an available web
            application, you can contact the site administrator by email.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Email
          </h2>
          <a
            href="mailto:seeraajs1@gmail.com"
            className="text-cyan-400 hover:text-cyan-300 transition-colors break-all"
          >
            seeraajs1@gmail.com
          </a>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Application Support
          </h2>
          <p>
            When reporting an application problem, please include the
            application name, version if known, the type of device you are
            using, and a short description of the problem. This helps us
            understand and investigate the issue more efficiently.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Feedback and Suggestions
          </h2>
          <p>
            Suggestions about the website, application features, usability,
            or future improvements are welcome. Please use the email address
            above for feedback and enquiries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Important
          </h2>
          <p>
            Siraj Ahmed Tech does not request passwords, authentication codes,
            payment card numbers, or other sensitive account credentials by
            email. Do not include sensitive information when contacting us.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
          >
            ← Back to Siraj Ahmed Tech
          </button>
        </div>
      </div>
    </div>
  );
}
