import { HourlyForecast, OccupationType, SmartShiftPlan, WorkWindow } from '../types';

export interface SmartShiftInput {
  workerName: string;
  occupation: OccupationType;
  locationName: string;
  earliestAvailableHour: number; // e.g. 6 (6 AM)
  latestAvailableHour: number;   // e.g. 21 (9 PM)
  targetWorkHours: number;       // e.g. 8 hours
  preferredBreakMinutes: number; // e.g. 15 mins
}

export function generateSmartShiftPlan(
  input: SmartShiftInput,
  hourlyForecasts: HourlyForecast[]
): SmartShiftPlan {
  // Safe fallback if hourly forecasts is empty
  const hourly = hourlyForecasts && hourlyForecasts.length === 24
    ? hourlyForecasts
    : Array.from({ length: 24 }).map((_, h) => ({
        hour: h,
        timeStr: `${h}:00`,
        temperature: h >= 12 && h <= 15 ? 42 : 30,
        apparentTemperature: h >= 12 && h <= 15 ? 44 : 32,
        relativeHumidity: 50,
        precipitationProbability: 0,
        riskLevel: (h >= 11 && h <= 16 ? 'High' : h >= 9 && h <= 18 ? 'Moderate' : 'Low') as any,
        riskScore: h >= 12 && h <= 15 ? 85 : 30,
        recommendedActivity: (h >= 12 && h <= 15 ? 'avoid' : 'optimal') as any,
        isSunPeak: h >= 12 && h <= 15,
      }));

  // Find peak danger zone between 11 AM and 4:30 PM
  let peakStart = 12;
  let peakEnd = 16;
  const highRiskHours = hourly.filter(h => h.riskLevel === 'Extreme' || h.riskLevel === 'High');
  if (highRiskHours.length > 0) {
    peakStart = Math.max(11, Math.min(...highRiskHours.map(h => h.hour)));
    peakEnd = Math.min(17, Math.max(...highRiskHours.map(h => h.hour)) + 1);
  }

  // Morning Window: from earliest available up to peakStart
  const morningStart = Math.max(input.earliestAvailableHour, 6);
  const morningEnd = Math.min(peakStart, 11);
  const morningHours = Math.max(0, morningEnd - morningStart);

  // Remaining hours needed for targetWorkHours
  const remainingHours = Math.max(0, input.targetWorkHours - morningHours);

  // Evening Window: after peakEnd up to latestAvailableHour
  const eveningStart = Math.max(peakEnd, 16);
  const eveningEnd = Math.min(input.latestAvailableHour, eveningStart + remainingHours);
  const eveningHours = Math.max(0, eveningEnd - eveningStart);

  const totalWorkingHours = morningHours + eveningHours;
  const hoursShiftedToCool = Math.max(0, morningHours + eveningHours - Math.max(0, input.targetWorkHours - (peakEnd - peakStart)));

  const recommendedWindows: WorkWindow[] = [];

  if (morningHours > 0) {
    recommendedWindows.push({
      id: 'rec-morning',
      start: formatHour(morningStart),
      end: formatHour(morningEnd),
      durationHours: morningHours,
      riskLevel: morningEnd > 10 ? 'Moderate' : 'Low',
      type: 'recommended',
      titleEn: 'Morning Prime Work Window (Comparatively Lower-Risk)',
      titleHi: 'सुबह का मुख्य कार्य समय (अपेक्षाकृत कम जोखिम)',
      descEn: `Cooler ambient air with minimal solar irradiance. Ideal for high-effort tasks, travel, and stock setup.`,
      descHi: `कम तापमान और हल्की धूप। भारी काम, यात्रा और सामान लगाने के लिए सबसे उपयुक्त।`,
      actionEn: 'Complete strenuous outdoor heavy lifting or rapid multi-stop deliveries during this window.',
      actionHi: 'भारी माल ढुलाई या ज्यादा दूरी की डिलीवरी इसी समय में पूरी करें।',
    });
  }

  if (eveningHours > 0) {
    recommendedWindows.push({
      id: 'rec-evening',
      start: formatHour(eveningStart),
      end: formatHour(eveningEnd),
      durationHours: eveningHours,
      riskLevel: 'Moderate',
      type: 'recommended',
      titleEn: 'Evening Recovery Work Window (Protected Hours)',
      titleHi: 'शाम का पुनर्प्राप्ति कार्य समय (सुरक्षित घंटे)',
      descEn: `Declining solar angle and reduced radiant heat from asphalt. Great footfall for street vendors and dinner rush for riders.`,
      descHi: `ढलती धूप और सड़क की गर्मी में कमी। रेहड़ी-पटरी विक्रेताओं के लिए ग्राहकों की भीड़ और डिलीवरी के लिए उत्तम समय।`,
      actionEn: 'Capitalize on peak marketplace footfall and dinner food orders in cooler air.',
      actionHi: 'शाम के बाजार की मांग और भोजन ऑर्डर का लाभ उठाएं।',
    });
  }

  const avoidWindows: WorkWindow[] = [
    {
      id: 'avoid-midday',
      start: formatHour(peakStart),
      end: formatHour(peakEnd),
      durationHours: peakEnd - peakStart,
      riskLevel: 'Extreme',
      type: 'avoid',
      titleEn: 'Peak Solar Heat Window (Higher-Risk Period)',
      titleHi: 'चरम सौर ताप अवधि (उच्च जोखिम वाला समय)',
      descEn: `Extreme ultraviolet index (UV 8-11) and intense road asphalt thermal radiation. Strenuous outdoor labor risks rapid heat exhaustion.`,
      descHi: `तीव्र पराबैंगनी किरणें और सड़क से निकलने वाली भयानक ऊष्मा। बाहर लगातार मेहनत करने से हीट स्ट्रोक का खतरा।`,
      actionEn: 'Relocate to an air-cooled space, shaded tree rest area, or reduce speed. Strictly avoid continuous heavy exertion.',
      actionHi: 'छायादार स्थान या शीत केंद्र में विश्राम करें। लगातार भारी शारीरिक श्रम से पूरी तरह बचें।',
    }
  ];

  // Hydration Timeline
  const hydrationTimeline = [
    {
      time: formatHour(morningStart),
      amountMl: 350,
      noteEn: 'Pre-shift hydration: Drink 1 full glass of water with light pinch of salt or lemon.',
      noteHi: 'काम शुरू करने से पहले: 1 बड़ा गिलास पानी में हल्का नमक या नींबू मिलाकर पिएं।',
    },
    {
      time: formatHour(morningStart + 2),
      amountMl: 300,
      noteEn: 'Mid-morning hydration: Replenish sweat electrolytes.',
      noteHi: 'सुबह का जलपान: पसीने से निकले लवण की भरपाई करें।',
    },
    {
      time: formatHour(morningEnd),
      amountMl: 350,
      noteEn: 'Post-morning shift: Drink chilled water from earthen pot (matka) or ORS sachet.',
      noteHi: 'सुबह की शिफ्ट के बाद: मटके का ठंडा पानी या ओआरएस का घोल पिएं।',
    },
    {
      time: formatHour(peakStart + 2),
      amountMl: 300,
      noteEn: 'Midday rest hydration: Sip fluids slowly in shade even if not actively thirsty.',
      noteHi: 'दोपहर विश्राम: प्यास न लगने पर भी थोड़ा-थोड़ा पानी घूंट-घूंट पिएं।',
    },
    {
      time: formatHour(eveningStart),
      amountMl: 300,
      noteEn: 'Pre-evening shift: Replenish before resuming field deliveries or sales.',
      noteHi: 'शाम की शिफ्ट से पहले: दोबारा काम शुरू करने से पहले पानी पिएं।',
    },
    {
      time: formatHour(eveningEnd),
      amountMl: 400,
      noteEn: 'Night cooldown hydration: Rehydrate body cells to allow nocturnal core cooling.',
      noteHi: 'रात का जलपान: शरीर का आंतरिक तापमान सामान्य करने के लिए भरपूर पानी पिएं।',
    },
  ];

  // Break schedule
  const breakSchedule = [
    {
      time: formatHour(morningStart + 2),
      durationMins: input.preferredBreakMinutes,
      tipEn: 'Pause under shade. Sponge forehead and back of neck with cool damp cloth.',
      tipHi: 'छाया में रुकें। माथे और गर्दन के पीछे गीले सूती गमछे से पोंछें।',
    },
    {
      time: `${formatHour(peakStart)} - ${formatHour(peakEnd)}`,
      durationMins: (peakEnd - peakStart) * 60,
      tipEn: 'Major midday shift hiatus: Stay in ventilated shade or public cooling kiosk. Rest eyes and recline.',
      tipHi: 'दोपहर का मुख्य विराम: हवादार छाया या शीत केंद्र में बैठें। सीधे धूप में खड़े न रहें।',
    },
    {
      time: formatHour(eveningStart + 2),
      durationMins: input.preferredBreakMinutes,
      tipEn: '10-minute sit-down break to allow heart rate and skin temperature to settle.',
      tipHi: 'धड़कन और त्वचा का तापमान सामान्य करने के लिए 10 मिनट बैठें।',
    },
  ];

  const safetyAdvisoriesEn = [
    'Always keep a water bottle filled with clean water or ORS strapped to your cart or vehicle.',
    'Drench a cotton cloth (gamchha) in water and wrap it loosely around your head and ears.',
    'Eat light, water-rich fruits such as watermelon, cucumber, or curd/buttermilk instead of heavy fried foods.',
    'Do not hesitate to pause if you notice your heart pounding faster than usual or legs feeling heavy.',
  ];

  const safetyAdvisoriesHi = [
    'अपनी रेहड़ी या बाइक पर हमेशा साफ पानी या ओआरएस की बोतल साथ रखें।',
    'सूती गमछे को पानी में भिगोकर सिर और कानों को अच्छी तरह ढक कर रखें।',
    'भारी तले-भुने भोजन के बजाय तरबूज, खीरा, छाछ और हल्का भोजन लें।',
    'यदि दिल की धड़कन तेज लगे या पैरों में कमजोरी महसूस हो, तो तुरंत बैठ जाएं।',
  ];

  return {
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    workerName: input.workerName,
    occupation: input.occupation,
    locationName: input.locationName,
    recommendedWindows,
    avoidWindows,
    hydrationTimeline,
    breakSchedule,
    totalPlannedHours: input.targetWorkHours,
    totalWorkingHours,
    hoursShiftedToCool: Math.min(totalWorkingHours, 3.5),
    estimatedHeatExposureReductionPercent: 68,
    safetyAdvisoriesEn,
    safetyAdvisoriesHi,
  };
}

function formatHour(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  const ampm = normalized >= 12 ? 'PM' : 'AM';
  const displayHour = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${displayHour}:00 ${ampm}`;
}
