import { WeatherCondition, HourlyForecast, HeatRiskAssessment, HeatRiskLevel, OccupationType } from '../types';

export interface CityPreset {
  name: string;
  nameHi: string;
  lat: number;
  lon: number;
  state: string;
}

export const POPULAR_CITIES: CityPreset[] = [
  { name: 'Delhi NCR', nameHi: 'दिल्ली एनसीआर', lat: 28.6139, lon: 77.2090, state: 'Delhi' },
  { name: 'Ahmedabad', nameHi: 'अहमदाबाद', lat: 23.0225, lon: 72.5714, state: 'Gujarat' },
  { name: 'Jaipur', nameHi: 'जयपुर', lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  { name: 'Lucknow', nameHi: 'लखनऊ', lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh' },
  { name: 'Nagpur', nameHi: 'नागपुर', lat: 21.1458, lon: 79.0882, state: 'Maharashtra' },
  { name: 'Mumbai', nameHi: 'मुंबई', lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
  { name: 'Chennai', nameHi: 'चेन्नई', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
  { name: 'Kolkata', nameHi: 'कोलकाता', lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
  { name: 'Bengaluru', nameHi: 'बेंगलुरु', lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
];

export async function fetchWeatherData(lat: number, lon: number): Promise<{
  current: WeatherCondition;
  hourly: HourlyForecast[];
}> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,uv_index&timezone=auto&forecast_days=1`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const currentData = data.current;
    const hourlyData = data.hourly;

    const weatherCondition: WeatherCondition = {
      temperature: Math.round(currentData.temperature_2m * 10) / 10,
      apparentTemperature: Math.round(currentData.apparent_temperature * 10) / 10,
      relativeHumidity: Math.round(currentData.relative_humidity_2m),
      weatherCode: currentData.weather_code,
      weatherText: getWeatherDescription(currentData.weather_code),
      windSpeed: Math.round(currentData.wind_speed_10m),
      uvIndex: hourlyData.uv_index ? Math.max(...hourlyData.uv_index.slice(10, 16)) : 8,
      isDay: currentData.is_day === 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
      source: 'Open-Meteo Live Meteorological API',
    };

    const hourlyForecasts: HourlyForecast[] = [];
    const times: string[] = hourlyData.time || [];
    const temps: number[] = hourlyData.temperature_2m || [];
    const apparentTemps: number[] = hourlyData.apparent_temperature || [];
    const humidities: number[] = hourlyData.relative_humidity_2m || [];
    const precipProb: number[] = hourlyData.precipitation_probability || [];

    for (let i = 0; i < Math.min(24, times.length); i++) {
      const date = new Date(times[i]);
      const hour = date.getHours();
      const appTemp = apparentTemps[i] ?? temps[i] ?? 32;
      const humidity = humidities[i] ?? 50;

      // Risk score calculation based on NOAA / IMD heat index standard
      let riskScore = 20;
      if (appTemp >= 44) riskScore = 95;
      else if (appTemp >= 40) riskScore = 80;
      else if (appTemp >= 35) riskScore = 65;
      else if (appTemp >= 30) riskScore = 40;
      else riskScore = 20;

      let riskLevel: HeatRiskLevel = 'Low';
      let rec: 'optimal' | 'caution' | 'reduced' | 'avoid' = 'optimal';

      if (riskScore >= 85) {
        riskLevel = 'Extreme';
        rec = 'avoid';
      } else if (riskScore >= 65) {
        riskLevel = 'High';
        rec = 'reduced';
      } else if (riskScore >= 40) {
        riskLevel = 'Moderate';
        rec = 'caution';
      }

      hourlyForecasts.push({
        hour,
        timeStr: `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        temperature: Math.round(temps[i] * 10) / 10,
        apparentTemperature: Math.round(appTemp * 10) / 10,
        relativeHumidity: Math.round(humidity),
        precipitationProbability: precipProb[i] ?? 0,
        riskLevel,
        riskScore,
        recommendedActivity: rec,
        isSunPeak: hour >= 12 && hour <= 15,
      });
    }

    return { current: weatherCondition, hourly: hourlyForecasts };
  } catch (error) {
    console.warn('Weather API unavailable or offline, switching smoothly to calibrated demo baseline:', error);
    return getDemoWeatherFallback();
  }
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Mostly Sunny / Light Clouds';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Hazy / Dust Suspension';
  if (code >= 51 && code <= 65) return 'Light Rain / Drizzle';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Sunny & Dry';
}

export function getDemoWeatherFallback(): {
  current: WeatherCondition;
  hourly: HourlyForecast[];
} {
  const current: WeatherCondition = {
    temperature: 41.5,
    apparentTemperature: 45.2,
    relativeHumidity: 48,
    weatherCode: 0,
    weatherText: 'Extreme Dry Heat (Heatwave Warning)',
    windSpeed: 14,
    uvIndex: 10,
    isDay: true,
    timestamp: '1:45 PM (DEMO)',
    isLive: false,
    source: 'DEMO / Calibrated Historical Model (Offline Fallback)',
  };

  const hourly: HourlyForecast[] = [];
  const tempProfile = [
    27, 26, 25, 25, 26, 28, 31, 34, 37, 39, 41, 42.5, 43, 42, 40, 38, 36, 34, 32, 31, 30, 29, 28, 27
  ];
  const humProfile = [
    75, 78, 80, 80, 78, 70, 62, 54, 46, 42, 38, 36, 35, 38, 42, 48, 55, 60, 65, 68, 70, 72, 73, 74
  ];

  for (let hour = 0; hour < 24; hour++) {
    const temp = tempProfile[hour];
    const hum = humProfile[hour];
    // Apparent temp approximation
    const appTemp = Math.round((temp + (hum > 50 ? (hum - 50) * 0.15 : -1)) * 10) / 10;

    let riskLevel: HeatRiskLevel = 'Low';
    let rec: 'optimal' | 'caution' | 'reduced' | 'avoid' = 'optimal';
    let riskScore = 25;

    if (appTemp >= 43) {
      riskLevel = 'Extreme';
      rec = 'avoid';
      riskScore = 95;
    } else if (appTemp >= 38) {
      riskLevel = 'High';
      rec = 'reduced';
      riskScore = 75;
    } else if (appTemp >= 32) {
      riskLevel = 'Moderate';
      rec = 'caution';
      riskScore = 48;
    }

    hourly.push({
      hour,
      timeStr: `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      temperature: temp,
      apparentTemperature: appTemp,
      relativeHumidity: hum,
      precipitationProbability: 0,
      riskLevel,
      riskScore,
      recommendedActivity: rec,
      isSunPeak: hour >= 12 && hour <= 15,
    });
  }

  return { current, hourly };
}

/**
 * Transparent, explainable prototype risk-scoring function.
 * Accounts for apparent temperature, humidity, worker trade physical load,
 * daily hours in the sun, and shade availability.
 */
export function calculateHeatRiskAssessment(
  weather: WeatherCondition,
  occupation: OccupationType,
  outdoorExposureHours: number,
  hasAccessToShade: boolean,
  hasAccessToWater: boolean
): HeatRiskAssessment {
  const appTemp = weather.apparentTemperature;
  const humidity = weather.relativeHumidity;

  // 1. Meteorological Heat Index base score (0 to 60)
  let baseScore = 20;
  if (appTemp >= 45) baseScore = 60;
  else if (appTemp >= 41) baseScore = 52;
  else if (appTemp >= 37) baseScore = 40;
  else if (appTemp >= 32) baseScore = 30;
  else baseScore = 15;

  // 2. Humidity penalty (evaporative cooling failure when humidity > 55% during high heat)
  let humidityPenalty = 0;
  if (appTemp >= 34 && humidity > 60) {
    humidityPenalty = 15;
  } else if (appTemp >= 32 && humidity > 50) {
    humidityPenalty = 8;
  }

  // 3. Occupational physical exertion load factor (0 to 18)
  let metabolicLoad = 5;
  let occFactorNameEn = 'Moderate metabolic activity';
  let occFactorNameHi = 'मध्यम शारीरिक परिश्रम';

  if (occupation === 'construction_worker') {
    metabolicLoad = 18;
    occFactorNameEn = 'Heavy physical manual labor (high internal heat production)';
    occFactorNameHi = 'भारी शारीरिक निर्माण कार्य (शरीर का उच्च आंतरिक ताप)';
  } else if (occupation === 'street_vendor') {
    metabolicLoad = 12;
    occFactorNameEn = 'Prolonged standing & roadside asphalt thermal radiation';
    occFactorNameHi = 'सड़क किनारे निरंतर खड़े रहना और डामर की ऊष्मा';
  } else if (occupation === 'delivery_worker') {
    metabolicLoad = 14;
    occFactorNameEn = 'Continuous traffic exposure, engine heat & helmet insulation';
    occFactorNameHi = 'यातायात, इंजन की गर्मी और हेलमेट में ऊष्मा जमा होना';
  } else if (occupation === 'logistics_worker') {
    metabolicLoad = 10;
    occFactorNameEn = 'Warehouse handling and vehicle movement';
    occFactorNameHi = 'गोदाम में लोडिंग और वाहन संचालन';
  }

  // 4. Exposure duration factor (0 to 12)
  let durationFactor = 0;
  if (outdoorExposureHours >= 8) durationFactor = 12;
  else if (outdoorExposureHours >= 6) durationFactor = 8;
  else if (outdoorExposureHours >= 4) durationFactor = 4;

  // 5. Mitigations (cooling buffers)
  let mitigationCredit = 0;
  if (hasAccessToShade) mitigationCredit += 6;
  if (hasAccessToWater) mitigationCredit += 6;

  const rawScore = Math.max(10, Math.min(100, baseScore + humidityPenalty + metabolicLoad + durationFactor - mitigationCredit));

  let level: HeatRiskLevel = 'Low';
  let color = '#15803D'; // Emerald green
  let badgeBg = '#DCFCE7';
  let labelEn = 'Low Risk';
  let labelHi = 'कम जोखिम';
  let summaryEn = 'Weather conditions are within manageable ranges. Maintain normal hydration.';
  let summaryHi = 'मौसम की स्थिति सामान्य सीमा में है। सामान्य पानी पीते रहें।';
  let hydrationTargetLitres = 2.5;
  let restBreakIntervalMins = 90;

  if (rawScore >= 82) {
    level = 'Extreme';
    color = '#DC2626'; // Deep Red
    badgeBg = '#FEE2E2';
    labelEn = 'Extreme Heat Emergency';
    labelHi = 'अत्यधिक आपातकालीन गर्मी';
    summaryEn = 'Dangerously high heat index with high risk of heat stroke. Outdoor strenuous work should be halted or shifted immediately.';
    summaryHi = 'हीट स्ट्रोक का अत्यधिक खतरा। दोपहर के भारी काम को तुरंत रोकें या सुबह/शाम में बदलें।';
    hydrationTargetLitres = 4.5;
    restBreakIntervalMins = 30;
  } else if (rawScore >= 62) {
    level = 'High';
    color = '#EA580C'; // Warm Orange
    badgeBg = '#FFEDD5';
    labelEn = 'High Heat Alert';
    labelHi = 'उच्च गर्मी चेतावनी';
    summaryEn = 'High thermal stress. Heat exhaustion and cramps are likely with prolonged outdoor activity. Mandatory shaded rest required.';
    summaryHi = 'तेज गर्मी और पसीने से कमजोरी का खतरा। अनिवार्य रूप से छाया में ब्रेक लें और ओआरएस पिएं।';
    hydrationTargetLitres = 3.8;
    restBreakIntervalMins = 45;
  } else if (rawScore >= 40) {
    level = 'Moderate';
    color = '#D97706'; // Amber
    badgeBg = '#FEF3C7';
    labelEn = 'Moderate Caution';
    labelHi = 'मध्यम सावधानी';
    summaryEn = 'Warm conditions requiring increased water intake and awareness of early fatigue signs.';
    summaryHi = 'गर्मी का प्रभाव बढ़ रहा है। अधिक पानी पिएं और थकान महसूस होने पर छाया में बैठें।';
    hydrationTargetLitres = 3.0;
    restBreakIntervalMins = 60;
  }

  const contributingFactors = [
    {
      nameEn: `Apparent Heat Index (${appTemp}°C)`,
      nameHi: `महसूस होने वाला तापमान (${appTemp}°C)`,
      impact: appTemp >= 40 ? ('High' as const) : appTemp >= 34 ? ('Moderate' as const) : ('Low' as const),
      descriptionEn: `Calculated feels-like temperature based on ambient air (${weather.temperature}°C) and atmospheric humidity.`,
      descriptionHi: `वातावरण के तापमान (${weather.temperature}°C) और नमी के आधार पर महसूस होने वाली वास्तविक गर्मी।`,
    },
    {
      nameEn: `Relative Humidity (${humidity}%)`,
      nameHi: `सापेक्ष आर्द्रता (${humidity}%)`,
      impact: humidity > 55 ? ('High' as const) : ('Moderate' as const),
      descriptionEn: humidity > 55 ? 'Elevated moisture impedes the natural evaporation of sweat, trapping internal body heat.' : 'Dry conditions permit some evaporative cooling, but accelerate dehydration.',
      descriptionHi: humidity > 55 ? 'हवा में अधिक नमी होने से पसीना नहीं सूखता और शरीर अंदर से गर्म होने लगता है।' : 'शुष्क हवा से पसीना तेजी से उड़ता है जिससे पानी की कमी जल्दी होती है।',
    },
    {
      nameEn: 'Occupational Metabolic Load',
      nameHi: 'कार्य भार और शारीरिक परिश्रम',
      impact: metabolicLoad >= 14 ? ('High' as const) : ('Moderate' as const),
      descriptionEn: occFactorNameEn,
      descriptionHi: occFactorNameHi,
    },
    {
      nameEn: `Sun Exposure Window (${outdoorExposureHours} hrs/day)`,
      nameHi: `धूप में बिताया समय (${outdoorExposureHours} घंटे/दिन)`,
      impact: outdoorExposureHours >= 7 ? ('High' as const) : ('Moderate' as const),
      descriptionEn: `Prolonged cumulative exposure amplifies core temperature elevation without recovery time.`,
      descriptionHi: `लगातार धूप में रहने से शरीर को सामान्य तापमान पर लौटने का समय नहीं मिलता।`,
    },
  ];

  const precautionsEn = [
    'Drink at least 250ml of clean water or oral rehydration solution (ORS) every 30 minutes.',
    `Take mandatory ${restBreakIntervalMins}-minute resting pauses in covered shade.`,
    'Avoid direct sun exposure between 12:00 PM and 3:30 PM whenever possible.',
    'Wear light-colored, breathable cotton clothing and keep the back of the neck shielded.',
    'Never continue working through dizziness, confusion, nausea, or muscle cramping.',
  ];

  const precautionsHi = [
    'हर 30 मिनट में कम से कम 250 मिलीलीटर साफ पानी या ओआरएस (ORS) का घोल पिएं।',
    `हर काम के चक्र में ${restBreakIntervalMins} मिनट का अनिवार्य छायादार विश्राम लें।`,
    'दोपहर 12:00 से 3:30 बजे के बीच सीधे धूप में खड़े होकर काम करने से बचें।',
    'हल्के रंग के सूती कपड़े पहनें और सिर व गर्दन को सूती गमछे से ढक कर रखें।',
    'चक्कर आने, सिर घूमने, जी मिचलाने या मांसपेशियों में ऐंठन होने पर तुरंत काम रोकें।',
  ];

  return {
    level,
    score: rawScore,
    color,
    badgeBg,
    labelEn,
    labelHi,
    summaryEn,
    summaryHi,
    contributingFactors,
    precautionsEn,
    precautionsHi,
    hydrationTargetLitres,
    restBreakIntervalMins,
    disclaimerEn: 'Indicative prototype risk model based on NOAA Heat Index and NIOSH occupational criteria. This is NOT a certified medical diagnosis.',
    disclaimerHi: 'यह मौसम विज्ञान और कार्य-भार पर आधारित एक सांकेतिक प्रोटोटाइप जोखिम अनुमान है। यह चिकित्सीय निदान नहीं है।',
  };
}
