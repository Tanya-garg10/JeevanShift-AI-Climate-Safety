import React, { useState } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  Info,
  RefreshCw,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  CalendarClock,
  MapPinCheck,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Language, WeatherCondition, HourlyForecast, HeatRiskAssessment, WorkerProfile } from '../types';
import { translations } from '../i18n/translations';
import { POPULAR_CITIES, CityPreset } from '../services/weatherService';

interface HeatRiskDashboardProps {
  weather: WeatherCondition;
  hourly: HourlyForecast[];
  assessment: HeatRiskAssessment;
  profile: WorkerProfile;
  language: Language;
  onRefreshWeather: () => void;
  onSelectCity: (city: CityPreset) => void;
  onNavigate: (tab: string) => void;
  isLoading: boolean;
  onDetectGPS?: () => void;
  isDetectingGPS?: boolean;
}

export const HeatRiskDashboard: React.FC<HeatRiskDashboardProps> = ({
  weather,
  hourly,
  assessment,
  profile,
  language,
  onRefreshWeather,
  onSelectCity,
  onNavigate,
  isLoading,
  onDetectGPS,
  isDetectingGPS = false,
}) => {
  const t = translations[language];
  const [selectedCityName, setSelectedCityName] = useState(profile.locationName);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCityName(cityName);
    const found = POPULAR_CITIES.find(c => c.name === cityName);
    if (found) {
      onSelectCity(found);
    }
  };

  // Format hourly data for recharts
  const chartData = hourly.map(item => ({
    hourStr: `${item.hour % 12 === 0 ? 12 : item.hour % 12} ${item.hour >= 12 ? 'PM' : 'AM'}`,
    apparentTemp: item.apparentTemperature,
    ambientTemp: item.temperature,
    humidity: item.relativeHumidity,
    riskLevel: item.riskLevel,
  }));

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Context Header & City Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>{t.dashboard.title}</span>
            <span>·</span>
            <span>{profile.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display mt-0.5">
            {profile.locationName}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {t.dashboard.subtitle} · Coordinates: <strong className="text-stone-700 tabular-nums">{profile.lat.toFixed(4)}°N, {profile.lon.toFixed(4)}°E</strong>
          </p>
        </div>

        {/* Location selector, GPS detection & live refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {onDetectGPS && (
            <button
              onClick={onDetectGPS}
              disabled={isDetectingGPS}
              className="px-3 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Detect my exact GPS location and fetch live weather"
            >
              <MapPin className={`w-3.5 h-3.5 text-blue-600 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isDetectingGPS ? 'Detecting...' : 'Exact GPS Weather'}</span>
              <span className="sm:hidden">GPS</span>
            </button>
          )}

          <div className="relative">
            <select
              value={selectedCityName}
              onChange={handleCityChange}
              className="appearance-none bg-white border border-stone-300 text-stone-800 text-xs font-medium rounded-lg px-3 py-2 pr-8 shadow-2xs hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              {POPULAR_CITIES.map(c => (
                <option key={c.name} value={c.name}>
                  {language === 'hi' ? c.nameHi : c.name} ({c.state})
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onRefreshWeather}
            disabled={isLoading}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Meteorological Readings"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Prominent "Today's Heat Risk" Hero Card */}
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header row: Status badge + Live / Demo indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-2xs"
              style={{
                backgroundColor: assessment.badgeBg,
                color: assessment.color,
                borderColor: `${assessment.color}40`,
              }}
            >
              {language === 'hi' ? assessment.labelHi : assessment.labelEn}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Score: <strong className="text-stone-800 tabular-nums">{assessment.score}/100</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className={`inline-block w-2 h-2 rounded-full ${weather.isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{weather.isLive ? t.dashboard.liveWeather : t.dashboard.demoFallback}</span>
            <span>·</span>
            <span className="tabular-nums">{weather.timestamp}</span>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>Ambient Temp</span>
              <Thermometer className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tabular-nums">
              {weather.temperature}°C
            </div>
            <div className="text-[11px] text-stone-500">
              {weather.weatherText}
            </div>
          </div>

          {/* Apparent Temp (Feels like / Heat index) */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/70 space-y-1">
            <div className="flex items-center justify-between text-orange-800 text-xs font-medium">
              <span>{t.dashboard.apparentTemp}</span>
              <Sun className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-950 font-display tabular-nums">
              {weather.apparentTemperature}°C
            </div>
            <div className="text-[11px] text-orange-800/80">
              NOAA Heat-Index formula
            </div>
          </div>

          {/* Relative Humidity */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>{t.dashboard.humidity}</span>
              <Droplets className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tabular-nums">
              {weather.relativeHumidity}%
            </div>
            <div className="text-[11px] text-stone-500">
              {weather.relativeHumidity > 55 ? 'High evaporative resistance' : 'Standard atmospheric moisture'}
            </div>
          </div>

          {/* UV & Wind */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>Peak UV / Wind</span>
              <Wind className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-display tabular-nums">
              UV {weather.uvIndex} · {weather.windSpeed} km/h
            </div>
            <div className="text-[11px] text-stone-500">
              Solar radiation intensity
            </div>
          </div>

        </div>

        {/* Explainable Risk Assessment Summary */}
        <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-2">
          <div className="text-xs font-bold text-stone-800 uppercase tracking-wide">
            {language === 'hi' ? 'जोखिम विश्लेषण सारांश' : 'Occupational Risk Analysis Summary'}
          </div>
          <p className="text-sm text-stone-800 leading-relaxed font-medium">
            {language === 'hi' ? assessment.summaryHi : assessment.summaryEn}
          </p>
        </div>

      </div>

      {/* Contributing Factors & Actionable Precautions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Contributing Factors (Left 6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-800" />
              <span>{t.dashboard.riskExplainTitle}</span>
            </h3>
            <span className="text-xs text-stone-400">Explainable Model</span>
          </div>

          <div className="space-y-3">
            {assessment.contributingFactors.map((factor, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">
                    {language === 'hi' ? factor.nameHi : factor.nameEn}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      factor.impact === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : factor.impact === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {factor.impact}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'hi' ? factor.descriptionHi : factor.descriptionEn}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-stone-400 italic">
            {language === 'hi' ? assessment.disclaimerHi : assessment.disclaimerEn}
          </div>
        </div>

        {/* Actionable Precautions "What should I do now?" (Right 6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>{t.dashboard.whatToDoTitle}</span>
              </h3>
              <span className="text-xs font-medium text-emerald-800">
                Target: {assessment.hydrationTargetLitres}L water/day
              </span>
            </div>

            <div className="space-y-2.5">
              {(language === 'hi' ? assessment.precautionsHi : assessment.precautionsEn).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/70 text-xs text-stone-800 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link to SmartShift */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-600">
              Shift high-intensity hours away from peak solar radiation.
            </div>
            <button
              onClick={() => onNavigate('smartshift')}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>{t.nav.smartShift}</span>
            </button>
          </div>

        </div>

      </div>

      {/* 24-Hour Heat Wave Timeline (Recharts) */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-700" />
              <span>{t.dashboard.hourlyCurveTitle}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {t.dashboard.hourlyCurveSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-400 inline-block" />
              <span>&lt; 34°C Lower Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
              <span>34–40°C Caution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
              <span>&gt; 40°C Red Zone</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="heatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hourStr" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} interval={2} />
              <YAxis domain={[20, 50]} tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} unit="°C" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-stone-900 text-white rounded-xl shadow-lg text-xs space-y-1">
                        <div className="font-bold text-amber-300">{data.hourStr}</div>
                        <div>Feels like: <strong>{data.apparentTemp}°C</strong></div>
                        <div>Ambient: {data.ambientTemp}°C</div>
                        <div>Humidity: {data.humidity}%</div>
                        <div className="text-[11px] text-stone-300">Category: {data.riskLevel}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={40} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Danger Threshold (40°C)', position: 'insideTopLeft', fill: '#DC2626', fontSize: 10 }} />
              <ReferenceLine y={34} stroke="#D97706" strokeDasharray="3 3" label={{ value: 'Caution Line (34°C)', position: 'insideTopLeft', fill: '#D97706', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="apparentTemp"
                stroke="#EA580C"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#heatGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
