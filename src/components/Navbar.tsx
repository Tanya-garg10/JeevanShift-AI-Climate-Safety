import React, { useState } from 'react';
import { SunMedium, ShieldAlert, User, Globe, Menu, X } from 'lucide-react';
import { Language, WorkerProfile } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  workerProfile: WorkerProfile;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  language,
  onToggleLanguage,
  workerProfile,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'landing', label: t.nav.landing },
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'smartshift', label: t.nav.smartShift },
    { id: 'points', label: t.nav.jeeveanPoints },
    { id: 'earnsafe', label: t.nav.earnSafe },
    { id: 'heatSOS', label: t.nav.heatSOS, isUrgent: true },
    { id: 'community', label: t.nav.community },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <SunMedium className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-emerald-950 font-display whitespace-nowrap">
                  {t.brand}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single line, clean typography) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              if (item.isUrgent) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-200'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                    <span>{item.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors text-xs xl:text-sm font-medium cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-800" />
              <span>{t.actions.switchLanguage}</span>
            </button>

            {/* Profile Avatar & Trigger */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title={t.profile.title}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                {workerProfile.name ? workerProfile.name[0].toUpperCase() : 'W'}
              </div>
              <span className="hidden md:inline-block text-xs font-medium text-stone-700 max-w-[90px] truncate">
                {workerProfile.name || 'Worker'}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="pb-2 mb-2 border-b border-stone-200">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Navigation Menu
            </span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentTab === item.id
                  ? item.isUrgent
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-900 text-white'
                  : item.isUrgent
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <span>{item.label}</span>
              {item.isUrgent && <span className="text-xs px-1.5 py-0.5 bg-rose-200 text-rose-900 rounded">112</span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
