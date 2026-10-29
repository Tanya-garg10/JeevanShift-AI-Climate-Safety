import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Filter,
  ExternalLink,
  Flag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Droplets,
  Trees,
  Snowflake,
  Cross,
  Building,
  Navigation,
  X,
  Plus,
} from 'lucide-react';
import { Language, SupportPoint, SupportCategory, WorkerProfile } from '../types';
import { translations } from '../i18n/translations';
import { SupportLeafletMap } from './SupportLeafletMap';

interface NearbySupportMapProps {
  supportPoints: SupportPoint[];
  profile: WorkerProfile;
  language: Language;
  onReportOutdated: (pointId: string, feedback: string) => void;
  onAddPointModalOpen: () => void;
  onDetectGPS?: () => void;
  isDetectingGPS?: boolean;
}

export const NearbySupportMap: React.FC<NearbySupportMapProps> = ({
  supportPoints,
  profile,
  language,
  onReportOutdated,
  onAddPointModalOpen,
  onDetectGPS,
  isDetectingGPS = false,
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<SupportPoint | null>(supportPoints[0] || null);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  
  // Report outdated modal state
  const [reportingPoint, setReportingPoint] = useState<SupportPoint | null>(null);
  const [reportText, setReportText] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const userGps = { lat: profile.lat, lon: profile.lon };

  // Compute approximate distance from worker location
  const pointsWithDistance = useMemo(() => {
    return supportPoints.map((pt) => {
      // Haversine distance formula approximation
      const latDiff = (pt.lat - profile.lat) * 111; // ~111km per degree
      const lonDiff = (pt.lon - profile.lon) * 111 * Math.cos((profile.lat * Math.PI) / 180);
      const dist = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
      return {
        ...pt,
        distanceKm: Math.round(dist * 10) / 10,
      };
    });
  }, [supportPoints, profile.lat, profile.lon]);

  // Filtered points
  const filteredPoints = useMemo(() => {
    return pointsWithDistance.filter((pt) => {
      const matchesCategory = selectedCategory === 'all' || pt.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        pt.name.toLowerCase().includes(query) ||
        (pt.nameHi && pt.nameHi.includes(query)) ||
        pt.address.toLowerCase().includes(query) ||
        pt.facilities.some((f) => f.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [pointsWithDistance, selectedCategory, searchQuery]);

  const handleOpenDirections = (pt: SupportPoint) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pt.lat},${pt.lon}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenReport = (pt: SupportPoint) => {
    setReportingPoint(pt);
    setReportText('');
    setReportSuccess(false);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportingPoint && reportText.trim()) {
      onReportOutdated(reportingPoint.id, reportText);
      setReportSuccess(true);
      setTimeout(() => {
        setReportingPoint(null);
        setReportSuccess(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>{t.nav.jeeveanPoints}</span>
            <span>·</span>
            <span>Local Resilience Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display mt-0.5">
            {language === 'hi' ? 'समीपस्थ जीवनपॉइंट्स नेटवर्क' : 'Nearby Cooling & Hydration Network'}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            {t.jeeveanPoints.subtitle}
          </p>
        </div>

        {/* Action buttons: GPS Detect & Add Support Point */}
        <div className="flex flex-wrap items-center gap-2">
          {onDetectGPS && (
            <button
              onClick={onDetectGPS}
              disabled={isDetectingGPS}
              className="px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              <span>{isDetectingGPS ? 'Locating...' : t.actions.useCurrentLocation}</span>
            </button>
          )}

          <button
            onClick={onAddPointModalOpen}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.actions.addPoint}</span>
          </button>
        </div>
      </div>

      {/* Active GPS status pill */}
      <div className="flex items-center justify-between text-xs text-stone-600 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Active Map Center: <strong>{profile.locationName}</strong> ({profile.lat.toFixed(4)}°N, {profile.lon.toFixed(4)}°E)</span>
        </div>
        <span className="text-[11px] text-stone-400">Distances auto-calculated from your current position</span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search by locality */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.jeeveanPoints.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View mode toggle on smaller screens */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'both' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.actions.viewMap}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.actions.viewList}
            </button>
          </div>
        </div>

        {/* Category Pill Filters (interactive filter controls) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {t.actions.filterAll} ({pointsWithDistance.length})
          </button>
          <button
            onClick={() => setSelectedCategory('water')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'water'
                ? 'bg-sky-700 text-white'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <span>💧</span>
            <span>{t.jeeveanPoints.categories.water}</span>
          </button>
          <button
            onClick={() => setSelectedCategory('shade')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'shade'
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span>🌳</span>
            <span>{t.jeeveanPoints.categories.shade}</span>
          </button>
          <button
            onClick={() => setSelectedCategory('cooling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'cooling'
                ? 'bg-teal-800 text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            <span>❄️</span>
            <span>{t.jeeveanPoints.categories.cooling}</span>
          </button>
          <button
            onClick={() => setSelectedCategory('clinic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'clinic'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <span>🏥</span>
            <span>{t.jeeveanPoints.categories.clinic}</span>
          </button>
          <button
            onClick={() => setSelectedCategory('facility')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'facility'
                ? 'bg-purple-800 text-white'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <span>🚻</span>
            <span>{t.jeeveanPoints.categories.facility}</span>
          </button>
        </div>
      </div>

      {/* Main Map + Card Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Leaflet OpenStreetMap */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className={`${viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-2`}>
            <div className="h-[460px] w-full rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs">
              <SupportLeafletMap
                points={filteredPoints}
                selectedPoint={selectedPoint}
                onSelectPoint={(pt) => setSelectedPoint(pt)}
                centerLat={profile.lat}
                centerLon={profile.lon}
                userGps={userGps}
                zoom={13}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500 px-2">
              <span>Interactive Leaflet Map · Centered near {profile.locationName}</span>
              <span>Click markers to view operating hours & services</span>
            </div>
          </div>
        )}

        {/* Right Column: Resource List & Detail Cards */}
        {(viewMode === 'both' || viewMode === 'list') && (
          <div className={`${viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-4 max-h-[520px] overflow-y-auto pr-1`}>
            {filteredPoints.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-stone-200 text-xs text-stone-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="font-semibold text-stone-700">No support points match your current filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-emerald-800 underline font-semibold cursor-pointer"
                >
                  Reset filters to view all facilities
                </button>
              </div>
            ) : (
              filteredPoints.map((pt) => {
                const isSelected = selectedPoint?.id === pt.id;
                return (
                  <div
                    key={pt.id}
                    onClick={() => setSelectedPoint(pt)}
                    className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-100 shadow-sm'
                        : 'border-stone-200/90 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-800">
                            {language === 'hi' && pt.nameHi ? pt.nameHi : pt.name}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {language === 'hi' && pt.addressHi ? pt.addressHi : pt.address}
                        </p>
                      </div>

                      {/* Verified vs Demo Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          pt.isDemo
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {pt.isDemo ? 'DEMO LOCATION' : 'VERIFIED'}
                      </span>
                    </div>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-1 border-t border-stone-100">
                      <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{pt.operatingHours}</span>
                      </div>
                      {pt.distanceKm !== undefined && (
                        <div className="flex items-center gap-1 text-stone-500 tabular-nums">
                          <Navigation className="w-3 h-3 text-stone-400" />
                          <span>~{pt.distanceKm} km</span>
                        </div>
                      )}
                    </div>

                    {/* Facilities provided */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pt.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[11px] rounded-md"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDirections(pt);
                        }}
                        className="font-semibold text-emerald-900 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t.actions.getDirections}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReport(pt);
                        }}
                        className="text-stone-400 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
                        title={t.actions.reportOutdated}
                      >
                        <Flag className="w-3 h-3" />
                        <span className="text-[11px]">Report</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* Report Outdated Info Modal */}
      {reportingPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 font-display">
                {t.jeeveanPoints.reportOutdatedTitle}
              </h3>
              <button
                onClick={() => setReportingPoint(null)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Reporting for: <strong>{reportingPoint.name}</strong>
            </p>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{t.jeeveanPoints.thankYouFeedback}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    What is the issue?
                  </label>
                  <textarea
                    rows={3}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="e.g. Water tap has run dry, shade canopy damaged, or center was locked during listed hours..."
                    required
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 placeholder:text-stone-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingPoint(null)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg cursor-pointer shadow-xs"
                  >
                    {t.jeeveanPoints.reportSubmit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
