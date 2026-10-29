import React from 'react';
import { ArrowRight, ThermometerSun, CalendarClock, MapPin, ShieldCheck, HeartHandshake, AlertTriangle, Sparkles, Droplets } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px]">
          
          {/* Left Column: Vision & Action */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-stone-50 font-display text-balance">
              {t.landing.headline}
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl">
              {t.landing.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <ThermometerSun className="w-4 h-4 text-emerald-950" />
                <span>{t.actions.checkRisk}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('smartshift')}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <CalendarClock className="w-4 h-4 text-emerald-300" />
                <span>{t.actions.exploreSmartShift}</span>
              </button>
            </div>

            {/* Micro social proof / context */}
            <div className="pt-4 flex items-center gap-6 text-xs text-stone-400 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Open-Meteo Meteorological Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Occupational Heat-Index Model</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>Zero Paid API Dependency</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <div className="absolute inset-0 bg-stone-900">
              <img
                src="/hero_worker_cooling_1793276737920.jpg"
                alt="Outdoor street vendor and delivery worker resting in shade with cool water"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-90 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  // Fallback container if local asset failed
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-emerald-950 lg:via-transparent lg:to-transparent" />
            </div>

            {/* Floating context pill inside visual */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-stone-200 space-y-1">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" />
                <span>Hydration & Shade Intervention</span>
              </div>
              <p className="text-stone-300 text-xs leading-snug">
                Protecting street vendors, delivery riders & daily wage labourers during scorching midday peaks.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3 Core Feature Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
            Built for Real-World Outdoor Work Conditions
          </h2>
          <p className="text-stone-600 text-sm">
            Not another passive weather forecast — an actionable livelihood and climate safety copilot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <ThermometerSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                {t.landing.card1Title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t.landing.card1Desc}
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 pt-2 group cursor-pointer"
            >
              <span>{t.actions.checkRisk}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                {t.landing.card2Title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t.landing.card2Desc}
              </p>
            </div>
            <button
              onClick={() => onNavigate('smartshift')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 pt-2 group cursor-pointer"
            >
              <span>{t.actions.exploreSmartShift}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                {t.landing.card3Title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t.landing.card3Desc}
              </p>
            </div>
            <button
              onClick={() => onNavigate('points')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 pt-2 group cursor-pointer"
            >
              <span>{t.nav.jeeveanPoints}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* How It Works 4-Step Pipeline */}
      <section className="p-8 sm:p-12 rounded-3xl bg-stone-100/80 border border-stone-200 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
            {t.landing.howItWorksTitle}
          </h2>
          <p className="text-sm text-stone-600">
            {t.landing.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Step 1
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {t.landing.step1Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.landing.step1Desc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Step 2
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {t.landing.step2Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.landing.step2Desc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Step 3
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {t.landing.step3Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.landing.step3Desc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Step 4
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {t.landing.step4Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.landing.step4Desc}
            </p>
          </div>

        </div>

        {/* Action strip inside pipeline */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
          <div className="text-xs text-stone-600">
            <strong>Ready to protect your day?</strong> Start with your personalized heat risk assessment.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
            >
              {t.actions.checkRisk}
            </button>
            <button
              onClick={() => onNavigate('earnsafe')}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition-colors cursor-pointer"
            >
              {t.nav.earnSafe}
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Disclaimer & Ethics notice */}
      <section className="p-6 rounded-2xl bg-white border border-stone-200 text-xs text-stone-500 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-stone-700">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>JeevanShift Ethical & Operational Principles</span>
        </div>
        <p className="leading-relaxed">
          • <strong>Livelihood Centric:</strong> We never recommend blanket stay-at-home bans that force informal workers into zero-income days. We empower workers to shift hours to cooler windows.
          <br />
          • <strong>Transparent Scoring:</strong> Risk scores are based on open meteorological indicators and NIOSH occupational criteria, not black-box medical diagnoses.
          <br />
          • <strong>Emergency First:</strong> For dizziness, slurred speech, or fever, workers are instructed to immediately seek shade and dial 112 emergency helpline.
        </p>
      </section>

    </div>
  );
};
