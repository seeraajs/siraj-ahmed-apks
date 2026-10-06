import React from 'react';

interface TermsViewProps {
  onNavigate: (view: 'home' | 'apps' | 'about' | 'privacy' | 'terms' | 'contact' | 'admin') => void;
}

export function TermsView({ onNavigate }: TermsViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">
          Legal Information
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Terms &amp; Conditions
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-8 text-slate-300 leading-7">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            1. About Siraj Ahmed Tech
          </h2>
          <p>
            Siraj Ahmed Tech is an independent software distribution website
            operated by Siraj Ahmed. The website provides information about
            applications and, where available, direct access to Android APK
            packages and web application versions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            2. Acceptance of These Terms
          </h2>
          <p>
            By accessing or using Siraj Ahmed Tech, you agree to these Terms
            &amp; Conditions and to use the website responsibly. If you do not
            agree with these terms, please do not use the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            3. Application Downloads
          </h2>
          <p>
            Applications made available through Siraj Ahmed Tech may be
            distributed as Android APK files or provided through external web
            application links. You are responsible for confirming that your
            device supports the application and that installing software from
            outside an official app store is appropriate for your device.
          </p>
          <p className="mt-3">
            Application versions, file sizes, availability, compatibility,
            features, and download locations may change without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. External Links and Applications
          </h2>
          <p>
            Some applications or services may open websites, web applications,
            or other resources hosted outside Siraj Ahmed Tech. Those external
            resources may have their own terms, privacy policies, and
            requirements. Siraj Ahmed Tech is not responsible for the policies
            or content of independently operated external services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            5. Website Features and User Interactions
          </h2>
          <p>
            The website may provide features such as application ratings,
            likes, download counting, application information, and links to
            available web versions. These features are provided for general
            website functionality and may be changed, limited, or removed when
            necessary.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            6. Acceptable Use
          </h2>
          <p>
            You agree not to misuse the website, attempt to interfere with its
            operation, gain unauthorized access to administrative functions,
            upload harmful content, or use the service for unlawful purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            7. Intellectual Property
          </h2>
          <p>
            Website design, branding, original text, graphics, and software
            created by Siraj Ahmed Tech remain the property of their respective
            owners unless otherwise stated. Third-party names, trademarks,
            logos, or application materials remain the property of their
            respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            8. Availability and Changes
          </h2>
          <p>
            Siraj Ahmed Tech may update, replace, suspend, or remove website
            features or application releases at any time. We do not guarantee
            that every application, download, or web application will always
            remain available.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            9. Disclaimer
          </h2>
          <p>
            The website and its available applications are provided on an
            "as available" basis. To the extent permitted by applicable law,
            Siraj Ahmed Tech does not guarantee that the website or every
            application will be uninterrupted, error-free, or compatible with
            every device or software environment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            10. Limitation of Responsibility
          </h2>
          <p>
            You are responsible for using downloaded applications and external
            services appropriately and for maintaining backups of important
            information. To the extent permitted by applicable law, Siraj Ahmed
            Tech is not responsible for losses resulting from misuse of the
            website, unsupported devices, third-party services, or changes to
            application availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            11. Updates to These Terms
          </h2>
          <p>
            These Terms &amp; Conditions may be updated when the website,
            applications, services, or legal requirements change. The latest
            version published on this page will apply to continued use of the
            website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            12. Contact
          </h2>
          <p>
            For questions regarding these Terms &amp; Conditions or Siraj
            Ahmed Tech, please use the Contact page available through the
            website navigation.
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
