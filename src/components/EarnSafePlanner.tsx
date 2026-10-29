import React, { useState, useMemo } from 'react';
import {
  Coins,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Building2,
  HeartHandshake,
  FileCheck,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Language, WorkerProfile } from '../types';
import { translations } from '../i18n/translations';
import { calculateEarnSafe } from '../services/earnSafeService';

interface EarnSafePlannerProps {
  profile: WorkerProfile;
  language: Language;
  onNavigate: (tab: string) => void;
}

export const EarnSafePlanner: React.FC<EarnSafePlannerProps> = ({
  profile,
  language,
  onNavigate,
}) => {
  const t = translations[language];

  // User input states
  const [expectedDailyIncome, setExpectedDailyIncome] = useState<number>(profile.dailyIncome || 750);
  const [originalHours, setOriginalHours] = useState<number>(profile.outdoorExposureHours || 9);
  const [adjustedHours, setAdjustedHours] = useState<number>(Math.max(4, (profile.outdoorExposureHours || 9) - 3));
  const [alternativeCoolHours, setAlternativeCoolHours] = useState<number>(3);

  // Dynamic calculations
  const result = useMemo(() => {
    return calculateEarnSafe(expectedDailyIncome, originalHours, adjustedHours, alternativeCoolHours);
  }, [expectedDailyIncome, originalHours, adjustedHours, alternativeCoolHours]);

  // Chart comparison data
  const comparisonData = [
    {
      name: language === 'hi' ? 'मूल अपेक्षित' : 'Original Shift',
      earnings: result.expectedDailyEarnings,
      fill: '#64748B', // Slate
    },
    {
      name: language === 'hi' ? 'कटौती (अनुकूलन बिना)' : 'Curtailed (No Split)',
      earnings: result.adjustedEarnings,
      fill: '#DC2626', // Red
    },
    {
      name: language === 'hi' ? 'स्मार्टशिफ्ट सुरक्षित' : 'SmartShift Protected',
      earnings: result.netProtectedEarnings,
      fill: '#15803D', // Emerald Green
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="pb-2 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <span>{t.earnSafe.title}</span>
          <span>·</span>
          <span>Livelihood Resilience</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display mt-0.5">
          {language === 'hi' ? 'आय सुरक्षा एवं आजीविका योजनाकार' : 'Income Gap & Recovery Calculator'}
        </h1>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl">
          {t.earnSafe.subtitle}
        </p>
      </div>

      {/* Main Grid: Inputs vs Calculation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Inputs (Left 5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>{t.earnSafe.calcTitle}</span>
            </h2>
            <span className="text-[11px] text-stone-400">User Inputs</span>
          </div>

          {/* Input 1: Expected Daily Earnings */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <label htmlFor="daily-income-input">{t.earnSafe.inputExpectedIncome}</label>
              <span className="font-bold text-emerald-900 text-sm tabular-nums">
                ₹{expectedDailyIncome}
              </span>
            </div>
            <input
              id="daily-income-input"
              type="number"
              min={100}
              max={5000}
              step={50}
              value={expectedDailyIncome}
              onChange={(e) => setExpectedDailyIncome(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono font-medium"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Street Vendor avg: ₹600–900</span>
              <span>Delivery rider: ₹800–1200</span>
            </div>
          </div>

          {/* Input 2: Original Planned Work Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <span>{t.earnSafe.inputOriginalHours}</span>
              <span className="font-bold text-stone-900 tabular-nums">{originalHours} hrs</span>
            </div>
            <input
              type="range"
              min={4}
              max={14}
              step={1}
              value={originalHours}
              onChange={(e) => {
                const val = Number(e.target.value);
                setOriginalHours(val);
                if (adjustedHours > val) setAdjustedHours(val);
              }}
              className="w-full accent-stone-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>4 hrs</span>
              <span>Baseline: {originalHours} hrs</span>
              <span>14 hrs</span>
            </div>
          </div>

          {/* Input 3: Adjusted Midday Hours (Curtailed for Safety) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <span>{t.earnSafe.inputAdjustedHours}</span>
              <span className="font-bold text-amber-700 tabular-nums">{adjustedHours} hrs</span>
            </div>
            <input
              type="range"
              min={1}
              max={originalHours}
              step={1}
              value={adjustedHours}
              onChange={(e) => setAdjustedHours(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>1 hr</span>
              <span>Midday cut: -{originalHours - adjustedHours} hrs</span>
              <span>{originalHours} hrs</span>
            </div>
          </div>

          {/* Input 4: Alternative Cooler Hours (Morning/Evening Shift) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <span>{t.earnSafe.inputAlternativeHours}</span>
              <span className="font-bold text-emerald-800 tabular-nums">{alternativeCoolHours} hrs</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={alternativeCoolHours}
              onChange={(e) => setAlternativeCoolHours(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0 hrs</span>
              <span>+3 hrs evening footfall</span>
              <span>6 hrs</span>
            </div>
          </div>

          {/* Hourly Rate Baseline info */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <span>Derived Hourly Earning Rate:</span>
            <strong className="text-stone-900 tabular-nums">~₹{result.hourlyRate} / hr</strong>
          </div>

        </div>

        {/* Dynamic Calculation Breakdown & Chart (Right 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* Unmitigated Loss */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
              <div className="flex items-center justify-between text-rose-800 text-xs">
                <span>Unmitigated Loss</span>
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-rose-950 font-display tabular-nums">
                -₹{result.potentialGap}
              </div>
              <div className="text-[11px] text-rose-800/80">
                {result.gapPercentage}% of daily earnings
              </div>
            </div>

            {/* Income Recovered via Cool Shift */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-emerald-800 text-xs">
                <span>Cool-Shift Recovery</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-display tabular-nums">
                +₹{result.alternativeHoursEarnings}
              </div>
              <div className="text-[11px] text-emerald-800/80">
                {result.recoveryPercentage}% gap recovered
              </div>
            </div>

            {/* Net Protected Daily Income */}
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-stone-900 text-white space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-stone-300 text-xs">
                <span>Net Protected</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-display tabular-nums">
                ₹{result.netProtectedEarnings}
              </div>
              <div className="text-[11px] text-stone-400">
                Net Gap: ₹{result.netProtectedGap}
              </div>
            </div>

          </div>

          {/* Visual Bar Comparison Chart */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 font-display flex items-center justify-between">
              <span>Earnings Comparison (₹ Daily Target)</span>
              <span className="text-xs text-stone-500 font-normal">Calculated in real-time</span>
            </h3>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} unit="₹" />
                  <Tooltip
                    formatter={(val: any) => [`₹${val}`, 'Daily Earnings']}
                    contentStyle={{ backgroundColor: '#18181B', borderRadius: '12px', border: 'none', color: '#FFF', fontSize: '12px' }}
                  />
                  <Bar dataKey="earnings" radius={[8, 8, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transparent Formula & Disclaimer */}
          <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200 text-xs text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-700">
              <AlertCircle className="w-3.5 h-3.5 text-stone-500" />
              <span>Transparent Estimation Transparency</span>
            </div>
            <p className="leading-relaxed">
              {t.earnSafe.disclaimer}
            </p>
          </div>

        </div>

      </div>

      {/* Practical Income Protection Pathways (4 actionable pillars) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-display">
          {t.earnSafe.mitigationStrategiesTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              {t.earnSafe.strategy1Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.earnSafe.strategy1Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              {t.earnSafe.strategy2Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.earnSafe.strategy2Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              {t.earnSafe.strategy3Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.earnSafe.strategy3Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              {t.earnSafe.strategy4Title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.earnSafe.strategy4Desc}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
