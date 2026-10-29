import React, { useState, useEffect, useCallback } from 'react';
import {
  ThermometerSun,
  CalendarClock,
  Coins,
  MapPin,
  ShieldAlert,
  Home,
  CheckCircle2,
} from 'lucide-react';
import {
  Language,
  WorkerProfile,
  WeatherCondition,
  HourlyForecast,
  HeatRiskAssessment,
  SupportPoint,
} from './types';
import { translations } from './i18n/translations';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredLanguage,
  saveStoredLanguage,
  getStoredSupportPoints,
  saveSupportPoint,
  deleteSupportPoint,
  resetSupportPointsToDefault,
} from './services/storageService';
import {
  fetchWeatherData,
  calculateHeatRiskAssessment,
  CityPreset,
  getDemoWeatherFallback,
} from './services/weatherService';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { HeatRiskDashboard } from './components/HeatRiskDashboard';
import { SmartShiftPlanner } from './components/SmartShiftPlanner';
import { NearbySupportMap } from './components/NearbySupportMap';
import { HeatSOSEmergency } from './components/HeatSOSEmergency';
import { EarnSafePlanner } from './components/EarnSafePlanner';
import { EmployerCommunityDashboard } from './components/EmployerCommunityDashboard';
import { WorkerProfileModal } from './components/WorkerProfileModal';

export default function App() {
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('landing');
  
  // Stored state
  const [language, setLanguage] = useState<Language>(getStoredLanguage);
  const [profile, setProfile] = useState<WorkerProfile>(getStoredProfile);
  const [supportPoints, setSupportPoints] = useState<SupportPoint[]>(getStoredSupportPoints);

  // Weather and risk state
  const [weather, setWeather] = useState<WeatherCondition>(() => getDemoWeatherFallback().current);
  const [hourly, setHourly] = useState<HourlyForecast[]>(() => getDemoWeatherFallback().hourly);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[language];

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Fetch real weather data from Open-Meteo API
  const loadWeather = useCallback(async (lat: number, lon: number, customLocationLabel?: string) => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchWeatherData(lat, lon);
      setWeather(data.current);
      setHourly(data.hourly);
      if (customLocationLabel) {
        showToast(`Live weather loaded for ${customLocationLabel}`);
      }
    } catch (err) {
      console.warn('Real weather API call failed, falling back to calibrated baseline:', err);
      const fallback = getDemoWeatherFallback();
      setWeather(fallback.current);
      setHourly(fallback.hourly);
      showToast('Offline fallback model active');
    } finally {
      setIsLoadingWeather(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    loadWeather(profile.lat, profile.lon);
  }, [loadWeather, profile.lat, profile.lon]);

  // Real browser GPS detection handler
  const handleDetectExactGPS = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingGPS(true);
    showToast('Requesting exact GPS coordinates from device...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const exactLat = Math.round(pos.coords.latitude * 10000) / 10000;
        const exactLon = Math.round(pos.coords.longitude * 10000) / 10000;

        // Reverse geocoding to get city name from coordinates
        let locationLabel = `GPS: ${exactLat.toFixed(4)}°N, ${exactLon.toFixed(4)}°E`;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${exactLat}&lon=${exactLon}&zoom=10`
          );
          const data = await response.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || 'Unknown Location';
            locationLabel = city;
          }
        } catch (error) {
          console.warn('Reverse geocoding failed:', error);
        }

        const updatedProfile: WorkerProfile = {
          ...profile,
          locationName: locationLabel,
          lat: exactLat,
          lon: exactLon,
        };

        setProfile(updatedProfile);
        saveStoredProfile(updatedProfile);
        setIsDetectingGPS(false);

        // Immediately fetch real weather from Open-Meteo using exact GPS coordinates
        loadWeather(exactLat, exactLon, locationLabel);
        showToast(`Located: ${locationLabel}. Live meteorological feed refreshed.`);
      },
      (err) => {
        console.warn('Geolocation permission error:', err);
        setIsDetectingGPS(false);
        showToast('GPS permission denied or unavailable. Using selected city preset.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [profile, loadWeather, showToast]);

  // Heat risk assessment computation
  const assessment: HeatRiskAssessment = calculateHeatRiskAssessment(
    weather,
    profile.occupation,
    profile.outdoorExposureHours,
    profile.hasAccessToShade,
    profile.hasAccessToWater
  );

  // Language toggle handler
  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    saveStoredLanguage(nextLang);
    showToast(nextLang === 'hi' ? 'भाषा हिन्दी में बदली गई' : 'Switched to English');
  };

  // Profile save handler
  const handleSaveProfile = (newProfile: WorkerProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
    if (newProfile.preferredLanguage !== language) {
      setLanguage(newProfile.preferredLanguage);
      saveStoredLanguage(newProfile.preferredLanguage);
    }
    loadWeather(newProfile.lat, newProfile.lon, newProfile.locationName);
    showToast(t.profile.savedSuccess);
  };

  // City selection handler
  const handleSelectCity = (city: CityPreset) => {
    const updated = {
      ...profile,
      locationName: city.name,
      lat: city.lat,
      lon: city.lon,
    };
    setProfile(updated);
    saveStoredProfile(updated);
    loadWeather(city.lat, city.lon, city.name);
    showToast(`Location set to ${city.name}`);
  };

  // Support Points CRUD
  const handleSaveSupportPoint = (point: SupportPoint) => {
    const updated = saveSupportPoint(point);
    setSupportPoints(updated);
    showToast('Support point saved successfully!');
  };

  const handleDeleteSupportPoint = (id: string) => {
    const updated = deleteSupportPoint(id);
    setSupportPoints(updated);
    showToast('Support point removed.');
  };

  const handleResetSupportPoints = () => {
    const defaultPoints = resetSupportPointsToDefault();
    setSupportPoints(defaultPoints);
    showToast('Support points reset to default locations.');
  };

  const handleReportOutdated = (pointId: string, feedback: string) => {
    console.log(`Feedback submitted for point ${pointId}:`, feedback);
    showToast(t.jeeveanPoints.thankYouFeedback);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        workerProfile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={setCurrentTab}
            language={language}
          />
        )}

        {currentTab === 'dashboard' && (
          <HeatRiskDashboard
            weather={weather}
            hourly={hourly}
            assessment={assessment}
            profile={profile}
            language={language}
            onRefreshWeather={() => loadWeather(profile.lat, profile.lon, profile.locationName)}
            onSelectCity={handleSelectCity}
            onNavigate={setCurrentTab}
            isLoading={isLoadingWeather}
            onDetectGPS={handleDetectExactGPS}
            isDetectingGPS={isDetectingGPS}
          />
        )}

        {currentTab === 'smartshift' && (
          <SmartShiftPlanner
            profile={profile}
            hourly={hourly}
            language={language}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'points' && (
          <NearbySupportMap
            supportPoints={supportPoints}
            profile={profile}
            language={language}
            onReportOutdated={handleReportOutdated}
            onAddPointModalOpen={() => setCurrentTab('community')}
            onDetectGPS={handleDetectExactGPS}
            isDetectingGPS={isDetectingGPS}
          />
        )}

        {currentTab === 'earnsafe' && (
          <EarnSafePlanner
            profile={profile}
            language={language}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'heatSOS' && (
          <HeatSOSEmergency
            profile={profile}
            language={language}
            supportPoints={supportPoints}
          />
        )}

        {currentTab === 'community' && (
          <EmployerCommunityDashboard
            supportPoints={supportPoints}
            weather={weather}
            language={language}
            onSavePoint={handleSaveSupportPoint}
            onDeletePoint={handleDeleteSupportPoint}
            onResetPoints={handleResetSupportPoints}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation Bar (thumb friendly) */}
      <nav className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentTab('landing')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            currentTab === 'landing' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            currentTab === 'dashboard' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <ThermometerSun className="w-4 h-4 mb-0.5" />
          <span>Risk</span>
        </button>

        <button
          onClick={() => setCurrentTab('smartshift')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            currentTab === 'smartshift' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <CalendarClock className="w-4 h-4 mb-0.5" />
          <span>Shift</span>
        </button>

        <button
          onClick={() => setCurrentTab('points')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            currentTab === 'points' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <MapPin className="w-4 h-4 mb-0.5" />
          <span>Support</span>
        </button>

        <button
          onClick={() => setCurrentTab('earnsafe')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            currentTab === 'earnsafe' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <Coins className="w-4 h-4 mb-0.5" />
          <span>Earn</span>
        </button>

        <button
          onClick={() => setCurrentTab('heatSOS')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold cursor-pointer ${
            currentTab === 'heatSOS' ? 'text-rose-700 bg-rose-50' : 'text-rose-600'
          }`}
        >
          <ShieldAlert className="w-4 h-4 mb-0.5 animate-pulse" />
          <span>SOS</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white/60 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 font-display text-sm">{t.brand}</span>
            <span>·</span>
            <span>{t.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Open-Meteo Meteorological Feed</span>
            <span>·</span>
            <span>NIOSH & NOAA Occupational Standard</span>
            <span>·</span>
            <span>Local Storage Persistence</span>
          </div>
        </div>
      </footer>

      {/* Worker Profile Modal */}
      <WorkerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        language={language}
      />

    </div>
  );
}
