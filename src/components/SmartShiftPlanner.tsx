import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  ShieldCheck,
  Droplets,
  AlertOctagon,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sun,
  Coffee,
  Check,
} from 'lucide-react';
import { Language, WorkerProfile, HourlyForecast, SmartShiftPlan, OccupationType } from '../types';
import { translations } from '../i18n/translations';
import { generateSmartShiftPlan } from '../services/smartShiftService';

interface SmartShiftPlannerProps {
  profile: WorkerProfile;
  hourly: HourlyForecast[];
  language: Language;
  onNavigate: (tab: string) => void;
}

export const SmartShiftPlanner: React.FC<SmartShiftPlannerProps> = ({
  profile,
  hourly,
  language,
  onNavigate,
}) => {
  const t = translations[language];

  // Configurable inputs
  const [occupation, setOccupation] = useState<OccupationType>(profile.occupation);
  const [earliestHour, setEarliestHour] = useState<number>(6); // 6 AM
  const [latestHour, setLatestHour] = useState<number>(21);   // 9 PM
  const [targetHours, setTargetHours] = useState<number>(profile.outdoorExposureHours || 8);
  const [breakMins, setBreakMins] = useState<number>(15);

  // Active generated plan state
  const [plan, setPlan] = useState<SmartShiftPlan>(() =>
    generateSmartShiftPlan(
      {
        workerName: profile.name,
        occupation: profile.occupation,
        locationName: profile.locationName,
        earliestAvailableHour: 6,
        latestAvailableHour: 21,
        targetWorkHours: profile.outdoorExposureHours || 8,
        preferredBreakMinutes: 15,
      },
      hourly
    )
  );

  const handleGeneratePlan = () => {
    const updatedPlan = generateSmartShiftPlan(
      {
        workerName: profile.name,
        occupation,
        locationName: profile.locationName,
        earliestAvailableHour: earliestHour,
        latestAvailableHour: latestHour,
        targetWorkHours: targetHours,
        preferredBreakMinutes: breakMins,
      },
      hourly
    );
    setPlan(updatedPlan);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="pb-2 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <span>{t.smartShift.title}</span>
          <span>·</span>
          <span>Core Differentiator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display mt-0.5">
          {language === 'hi' ? 'स्मार्ट कार्य समय-निर्धारण' : 'Intelligent Split-Shift Scheduler'}
        </h1>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl">
          {t.smartShift.subtitle}
        </p>
      </div>

      {/* Input Configuration & Rule Engine Panel */}
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-800" />
            <span>{t.smartShift.configTitle}</span>
          </h2>
          <span className="text-xs text-stone-400 font-medium">
            Deterministic Rule Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Occupation Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              {t.profile.occupation}
            </label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value as OccupationType)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="street_vendor">{t.profile.occupations.street_vendor}</option>
              <option value="delivery_worker">{t.profile.occupations.delivery_worker}</option>
              <option value="construction_worker">{t.profile.occupations.construction_worker}</option>
              <option value="logistics_worker">{t.profile.occupations.logistics_worker}</option>
              <option value="other">{t.profile.occupations.other}</option>
            </select>
          </div>

          {/* Daily Work Target Duration */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <span>{t.smartShift.targetDuration}</span>
              <span className="text-emerald-800 font-bold tabular-nums">{targetHours} Hours</span>
            </div>
            <input
              type="range"
              min={4}
              max={12}
              step={1}
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>4 hrs</span>
              <span>8 hrs</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Available Window Start / End */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Earliest Start & Latest End
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={earliestHour}
                onChange={(e) => setEarliestHour(Number(e.target.value))}
                className="bg-stone-50 border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-medium text-stone-800"
              >
                <option value={5}>5:00 AM</option>
                <option value={6}>6:00 AM</option>
                <option value={7}>7:00 AM</option>
                <option value={8}>8:00 AM</option>
              </select>
              <select
                value={latestHour}
                onChange={(e) => setLatestHour(Number(e.target.value))}
                className="bg-stone-50 border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-medium text-stone-800"
              >
                <option value={19}>7:00 PM</option>
                <option value={20}>8:00 PM</option>
                <option value={21}>9:00 PM</option>
                <option value={22}>10:00 PM</option>
              </select>
            </div>
          </div>

          {/* Rest Break Interval */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              {t.smartShift.breakFrequency}
            </label>
            <select
              value={breakMins}
              onChange={(e) => setBreakMins(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value={10}>10 min break every 45 mins</option>
              <option value={15}>15 min break every hour (Recommended)</option>
              <option value={20}>20 min break every 90 mins</option>
            </select>
          </div>

        </div>

        {/* Generate Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            {t.smartShift.timelineNotice}
          </p>
          <button
            onClick={handleGeneratePlan}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.smartShift.generateBtn}</span>
          </button>
        </div>
      </div>

      {/* Visual 24-Hour Timeline Bar (Green / Amber / Red blocks) */}
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-700" />
            <span>24-Hour Thermal Exposure & Shift Allocation Timeline</span>
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
              <span>{t.smartShift.timelineLegendLow}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
              <span>{t.smartShift.timelineLegendModerate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
              <span>{t.smartShift.timelineLegendHigh}</span>
            </div>
          </div>
        </div>

        {/* 24-Hour segmented blocks */}
        <div className="space-y-1 pt-2">
          <div className="grid grid-cols-24 h-10 w-full rounded-xl overflow-hidden border border-stone-300">
            {hourly.map((h) => {
              let blockBg = 'bg-emerald-400';
              if (h.riskLevel === 'Extreme') blockBg = 'bg-rose-600';
              else if (h.riskLevel === 'High') blockBg = 'bg-rose-400';
              else if (h.riskLevel === 'Moderate') blockBg = 'bg-amber-400';

              return (
                <div
                  key={h.hour}
                  className={`${blockBg} border-r border-white/30 last:border-r-0 relative group flex items-center justify-center transition-opacity hover:opacity-80`}
                  title={`${h.timeStr}: ${h.apparentTemperature}°C (${h.riskLevel})`}
                >
                  <span className="hidden md:inline-block text-[9px] text-white font-bold opacity-80">
                    {h.hour}
                  </span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:block z-30 p-2 bg-stone-900 text-white text-[11px] rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                    <div><strong>{h.timeStr}</strong>: {h.apparentTemperature}°C</div>
                    <div className="text-stone-300">{h.riskLevel} Heat Risk</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time markers beneath */}
          <div className="flex justify-between text-[10px] text-stone-400 font-medium px-1">
            <span>12 AM</span>
            <span>4 AM</span>
            <span>8 AM</span>
            <span>12 PM (Peak Danger)</span>
            <span>4 PM</span>
            <span>8 PM</span>
            <span>11 PM</span>
          </div>
        </div>
      </div>

      {/* Plan Output: Recommended Windows vs High-Risk Avoid Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Windows (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <Sun className="w-4 h-4 text-emerald-800" />
              <span>{t.smartShift.recommendedWindowsTitle}</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
              {plan.totalWorkingHours} Safe Hours
            </span>
          </div>

          <div className="space-y-3">
            {plan.recommendedWindows.map((win) => (
              <div
                key={win.id}
                className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3 transition-all hover:border-emerald-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div className="text-sm font-bold text-stone-900">
                    {language === 'hi' ? win.titleHi : win.titleEn}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 tabular-nums">
                      {win.start} — {win.end} ({win.durationHours} hrs)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'hi' ? win.descHi : win.descEn}
                </p>

                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80 text-xs text-emerald-950 font-medium flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{language === 'hi' ? win.actionHi : win.actionEn}</span>
                </div>
              </div>
            ))}
          </div>

          {/* High-Risk Midday Window to Avoid */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>{t.smartShift.avoidWindowsTitle}</span>
            </div>

            {plan.avoidWindows.map((win) => (
              <div
                key={win.id}
                className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/90 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-2">
                  <span className="text-sm font-bold text-rose-950">
                    {language === 'hi' ? win.titleHi : win.titleEn}
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-300 tabular-nums">
                    {win.start} — {win.end} ({win.durationHours} hrs)
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {language === 'hi' ? win.descHi : win.descEn}
                </p>

                <div className="p-2.5 rounded-xl bg-rose-100/60 border border-rose-200 text-xs text-rose-950 font-medium flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <span>{language === 'hi' ? win.actionHi : win.actionEn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Hydration Schedule & Mandatory Rest Intervals */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Hydration Schedule */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>{t.smartShift.hydrationTimelineTitle}</span>
            </h3>

            <div className="space-y-3">
              {plan.hydrationTimeline.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs">
                  <div className="font-bold text-sky-900 shrink-0 tabular-nums">
                    {item.time}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-stone-800">
                      Drink {item.amountMl}ml
                    </span>
                    <p className="text-[11px] text-stone-600">
                      {language === 'hi' ? item.noteHi : item.noteEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rest Breaks Schedule */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-700" />
              <span>{t.smartShift.breakAdvisoryTitle}</span>
            </h3>

            <div className="space-y-3">
              {plan.breakSchedule.map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 tabular-nums">
                      {b.time}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800 px-1.5 py-0.5 bg-amber-100 rounded">
                      {b.durationMins} min pause
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-snug">
                    {language === 'hi' ? b.tipHi : b.tipEn}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('earnsafe')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Calculate Income Impact with EarnSafe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
