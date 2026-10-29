import React, { useState } from 'react';
import {
  User,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  X,
  CheckCircle2,
  Lock,
  Globe,
} from 'lucide-react';
import { Language, WorkerProfile, OccupationType } from '../types';
import { translations } from '../i18n/translations';
import { POPULAR_CITIES } from '../services/weatherService';

interface WorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WorkerProfile;
  onSaveProfile: (profile: WorkerProfile) => void;
  language: Language;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  language,
}) => {
  const t = translations[language];

  const [name, setName] = useState(profile.name);
  const [occupation, setOccupation] = useState<OccupationType>(profile.occupation);
  const [locationName, setLocationName] = useState(profile.locationName);
  const [lat, setLat] = useState(profile.lat);
  const [lon, setLon] = useState(profile.lon);
  const [typicalHoursStart, setTypicalHoursStart] = useState(profile.typicalHoursStart);
  const [typicalHoursEnd, setTypicalHoursEnd] = useState(profile.typicalHoursEnd);
  const [outdoorExposureHours, setOutdoorExposureHours] = useState(profile.outdoorExposureHours);
  const [dailyIncome, setDailyIncome] = useState(profile.dailyIncome);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(profile.preferredLanguage);
  const [hasAccessToShade, setHasAccessToShade] = useState(profile.hasAccessToShade);
  const [hasAccessToWater, setHasAccessToWater] = useState(profile.hasAccessToWater);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = POPULAR_CITIES.find((c) => c.name === e.target.value);
    if (selected) {
      setLocationName(selected.name);
      setLat(selected.lat);
      setLon(selected.lon);
    }
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Math.round(pos.coords.latitude * 10000) / 10000);
          setLon(Math.round(pos.coords.longitude * 10000) / 10000);
          setLocationName(`GPS Location (${Math.round(pos.coords.latitude * 100) / 100}, ${Math.round(pos.coords.longitude * 100) / 100})`);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert('GPS permission not granted. Selected city presets can be used instead.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WorkerProfile = {
      name: name.trim() || 'Worker',
      occupation,
      locationName,
      lat,
      lon,
      typicalHoursStart,
      typicalHoursEnd,
      outdoorExposureHours,
      dailyIncome,
      preferredLanguage,
      hasAccessToShade,
      hasAccessToWater,
    };

    onSaveProfile(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 border border-stone-200 my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>{t.nav.profile}</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 font-display mt-0.5">
              {t.profile.title}
            </h2>
            <p className="text-xs text-stone-500">
              {t.profile.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{t.profile.savedSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Worker Name & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                {t.profile.workerName}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.profile.workerNamePlaceholder}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                {t.profile.occupation}
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value as OccupationType)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="street_vendor">{t.profile.occupations.street_vendor}</option>
                <option value="delivery_worker">{t.profile.occupations.delivery_worker}</option>
                <option value="construction_worker">{t.profile.occupations.construction_worker}</option>
                <option value="logistics_worker">{t.profile.occupations.logistics_worker}</option>
                <option value="other">{t.profile.occupations.other}</option>
              </select>
            </div>
          </div>

          {/* Location & GPS */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <label>{t.profile.workLocation}</label>
              <button
                type="button"
                onClick={handleUseGPS}
                className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3 h-3" />
                <span>{t.actions.useCurrentLocation}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                onChange={handleCitySelect}
                className="p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="">-- Choose Popular City Preset --</option>
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>

              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Or custom area landmark (e.g. Kashmere Gate)"
                className="p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          {/* Hours & Outdoor Exposure */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">{t.profile.hoursStart}</label>
              <input
                type="time"
                value={typicalHoursStart}
                onChange={(e) => setTypicalHoursStart(e.target.value)}
                className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">{t.profile.hoursEnd}</label>
              <input
                type="time"
                value={typicalHoursEnd}
                onChange={(e) => setTypicalHoursEnd(e.target.value)}
                className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Outdoor Exposure (hrs)</label>
              <input
                type="number"
                min={1}
                max={16}
                value={outdoorExposureHours}
                onChange={(e) => setOutdoorExposureHours(Number(e.target.value))}
                className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-xl tabular-nums font-mono"
              />
            </div>
          </div>

          {/* Daily Income Target & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                {t.profile.dailyIncome}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={dailyIncome}
                  onChange={(e) => setDailyIncome(Number(e.target.value))}
                  placeholder="e.g. 750"
                  className="w-full pl-7 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl tabular-nums font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                {t.profile.languagePref}
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          {/* Access to shade & water */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAccessToShade}
                onChange={(e) => setHasAccessToShade(e.target.checked)}
                className="accent-emerald-800 rounded"
              />
              <span>{t.profile.sunProtection}</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAccessToWater}
                onChange={(e) => setHasAccessToWater(e.target.checked)}
                className="accent-emerald-800 rounded"
              />
              <span>{t.profile.waterAccess}</span>
            </label>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 text-[11px] text-stone-500 leading-snug pt-1">
            <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>{t.profile.privacyNote}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {t.actions.saveProfile}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
