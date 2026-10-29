import { EarnSafeResult } from '../types';

export function calculateEarnSafe(
  expectedDailyEarnings: number,
  originalHours: number,
  adjustedHours: number,
  alternativeHoursWorked: number
): EarnSafeResult {
  const safeDailyEarnings = Math.max(0, expectedDailyEarnings);
  const safeOriginalHours = Math.max(1, originalHours);
  const safeAdjustedHours = Math.max(0, Math.min(safeOriginalHours, adjustedHours));
  const safeAlternativeHours = Math.max(0, alternativeHoursWorked);

  const hourlyRate = Math.round((safeDailyEarnings / safeOriginalHours) * 10) / 10;
  
  // Earnings under curtailed midday schedule alone
  const adjustedEarnings = Math.round(safeAdjustedHours * hourlyRate);
  
  // Unmitigated gap if worker merely cuts midday hours without evening/morning compensation
  const potentialGap = Math.max(0, safeDailyEarnings - adjustedEarnings);
  const gapPercentage = Math.round((potentialGap / safeDailyEarnings) * 100);

  // Alternative cool hours earnings (evening/morning has comparable or slightly higher commercial volume)
  const eveningDemandFactor = 1.05; // 5% boost for evening market footfall / dinner delivery orders
  const alternativeHoursEarnings = Math.round(safeAlternativeHours * hourlyRate * eveningDemandFactor);

  const netProtectedEarnings = Math.min(
    Math.round(adjustedEarnings + alternativeHoursEarnings),
    Math.round(safeDailyEarnings * 1.15)
  );

  const netProtectedGap = Math.max(0, safeDailyEarnings - netProtectedEarnings);
  const recoveryPercentage = potentialGap > 0
    ? Math.min(100, Math.round((alternativeHoursEarnings / potentialGap) * 100))
    : 100;

  return {
    expectedDailyEarnings: safeDailyEarnings,
    originalHours: safeOriginalHours,
    adjustedHours: safeAdjustedHours,
    hourlyRate,
    adjustedEarnings,
    potentialGap,
    gapPercentage,
    alternativeHoursWorked: safeAlternativeHours,
    alternativeHoursEarnings,
    netProtectedEarnings,
    netProtectedGap,
    recoveryPercentage,
  };
}
