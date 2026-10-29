import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsPrivacyPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>{isRTL ? 'الشفافية والأمان' : 'Transparency & Legal Compliance'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'الشروط والأحكام وسياسة الخصوصية' : 'Terms of Service & Privacy Policy'}
          </h1>
          <p className="text-xs text-slate-500">Last updated: October 2026 • AQAR IN (عقار إن) Egypt</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0B1C3D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>1. Property Listings & Market Information Accuracy</span>
            </h2>
            <p className="text-xs text-slate-500">
              Listings, photos, specifications, and geospatial data published on AQAR IN are verified through title deed audit and developer records. Price benchmarks reflect actual aggregated market trends in Egyptian compounds. Users are encouraged to conduct on-site physical inspections prior to final contract execution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0B1C3D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>2. Fast Sell & Property Exchange Guidelines</span>
            </h2>
            <p className="text-xs text-slate-500">
              Fast Sell cash purchase offers and Property Exchange matching services are facilitated directly with verified buyers and legal partners. Terms, price settlements, and monetary adjustments are formalized under Egyptian property law with transparent contract documentation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0B1C3D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>3. User Data Privacy & Encryption</span>
            </h2>
            <p className="text-xs text-slate-500">
              Your personal data, property submissions, and financial inquiries are encrypted using industry-standard 256-bit SSL encryption. We never sell or share confidential buyer contact information without explicit authorization.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

