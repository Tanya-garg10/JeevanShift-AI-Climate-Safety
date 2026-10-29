export type Language = 'en' | 'hi';

export type OccupationType =
  | 'street_vendor'
  | 'delivery_worker'
  | 'construction_worker'
  | 'logistics_worker'
  | 'other';

export interface WorkerProfile {
  name: string;
  occupation: OccupationType;
  locationName: string;
  lat: number;
  lon: number;
  typicalHoursStart: string; // "09:00"
  typicalHoursEnd: string;   // "18:00"
  outdoorExposureHours: number;
  dailyIncome: number;
  preferredLanguage: Language;
  hasAccessToShade: boolean;
  hasAccessToWater: boolean;
}

export type HeatRiskLevel = 'Low' | 'Moderate' | 'High' | 'Extreme';

export interface WeatherCondition {
  temperature: number;          // °C
  apparentTemperature: number;  // °C Feels like / Heat Index
  relativeHumidity: number;     // %
  weatherCode: number;
  weatherText: string;
  windSpeed: number;            // km/h
  uvIndex: number;
  isDay: boolean;
  timestamp: string;
  isLive: boolean;
  source: string;
}

export interface HourlyForecast {
  hour: number;
  timeStr: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  riskLevel: HeatRiskLevel;
  riskScore: number;
  recommendedActivity: 'optimal' | 'caution' | 'reduced' | 'avoid';
  isSunPeak: boolean;
}

export interface HeatRiskAssessment {
  level: HeatRiskLevel;
  score: number; // 0-100
  color: string;
  badgeBg: string;
  labelEn: string;
  labelHi: string;
  summaryEn: string;
  summaryHi: string;
  contributingFactors: {
    nameEn: string;
    nameHi: string;
    impact: 'Low' | 'Moderate' | 'High';
    descriptionEn: string;
    descriptionHi: string;
  }[];
  precautionsEn: string[];
  precautionsHi: string[];
  hydrationTargetLitres: number;
  restBreakIntervalMins: number;
  disclaimerEn: string;
  disclaimerHi: string;
}

export interface WorkWindow {
  id: string;
  start: string;
  end: string;
  durationHours: number;
  riskLevel: HeatRiskLevel;
  type: 'recommended' | 'avoid' | 'rest';
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  actionEn: string;
  actionHi: string;
}

export interface SmartShiftPlan {
  generatedAt: string;
  workerName: string;
  occupation: OccupationType;
  locationName: string;
  recommendedWindows: WorkWindow[];
  avoidWindows: WorkWindow[];
  hydrationTimeline: { time: string; amountMl: number; noteEn: string; noteHi: string }[];
  breakSchedule: { time: string; durationMins: number; tipEn: string; tipHi: string }[];
  totalPlannedHours: number;
  totalWorkingHours: number;
  hoursShiftedToCool: number;
  estimatedHeatExposureReductionPercent: number;
  safetyAdvisoriesEn: string[];
  safetyAdvisoriesHi: string[];
}

export type SupportCategory = 'water' | 'shade' | 'cooling' | 'clinic' | 'facility';

export interface SupportPoint {
  id: string;
  name: string;
  nameHi: string;
  category: SupportCategory;
  address: string;
  addressHi: string;
  lat: number;
  lon: number;
  operatingHours: string;
  facilities: string[];
  isVerified: boolean;
  isDemo: boolean;
  contactNumber?: string;
  notes?: string;
  distanceKm?: number;
}

export interface EarnSafeResult {
  expectedDailyEarnings: number;
  originalHours: number;
  adjustedHours: number;
  hourlyRate: number;
  adjustedEarnings: number;
  potentialGap: number;
  gapPercentage: number;
  alternativeHoursWorked: number;
  alternativeHoursEarnings: number;
  netProtectedEarnings: number;
  netProtectedGap: number;
  recoveryPercentage: number;
}
