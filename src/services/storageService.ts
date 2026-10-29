import { WorkerProfile, SupportPoint, Language } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'jeevanshift_worker_profile',
  LANGUAGE: 'jeevanshift_language',
  SUPPORT_POINTS: 'jeevanshift_support_points',
};

export const DEFAULT_PROFILE: WorkerProfile = {
  name: 'Rajesh Kumar',
  occupation: 'street_vendor',
  locationName: 'Kashmere Gate, Old Delhi',
  lat: 28.6675,
  lon: 77.2285,
  typicalHoursStart: '09:00',
  typicalHoursEnd: '19:00',
  outdoorExposureHours: 8,
  dailyIncome: 750,
  preferredLanguage: 'en',
  hasAccessToShade: false,
  hasAccessToWater: true,
};

export const INITIAL_SUPPORT_POINTS: SupportPoint[] = [
  {
    id: 'jp-1',
    name: 'Kashmere Gate Metro Transit Cooling Kiosk',
    nameHi: 'कश्मीरी गेट मेट्रो शीतल ट्रांजिट कियोस्क',
    category: 'cooling',
    address: 'Gate 2, Kashmere Gate Inter-State Bus Terminus Area, Delhi',
    addressHi: 'गेट 2, कश्मीरी गेट आईएसबीटी क्षेत्र, दिल्ली',
    lat: 28.6675,
    lon: 77.2285,
    operatingHours: '06:00 AM - 10:00 PM',
    facilities: ['Air-Cooled Seating', 'Free RO Cold Water', 'Phone Charging Point', 'ORS Packets'],
    isVerified: true,
    isDemo: false,
    contactNumber: '+91-11-23861234',
    notes: 'Municipal heat relief transit station for bus commuters and auto drivers.',
  },
  {
    id: 'jp-2',
    name: 'Gurudwara Sis Ganj Free Chabeel & Water Station',
    nameHi: 'गुरुद्वारा सीस गंज साहिब मुफ्त छबील एवं जल सेवा',
    category: 'water',
    address: 'Chandni Chowk Main Road, Near Old Delhi Railway Station, Delhi',
    addressHi: 'चांदनी चौक मुख्य मार्ग, पुरानी दिल्ली रेलवे स्टेशन के पास',
    lat: 28.6558,
    lon: 77.2323,
    operatingHours: '24 Hours / Always Open',
    facilities: ['Free Cold Sweetened Water (Chabeel)', 'Covered Marble Verandah Shade', 'Resting Mats'],
    isVerified: true,
    isDemo: false,
    contactNumber: '+91-11-23285000',
    notes: 'Continuous volunteer community cold drinking water station open to all workers.',
  },
  {
    id: 'jp-3',
    name: 'MCD Urban Primary Health Centre (Aam Aadmi Mohalla Clinic)',
    nameHi: 'शहरी प्राथमिक स्वास्थ्य केंद्र (मोहल्ला क्लिनिक)',
    category: 'clinic',
    address: 'Daryaganj Community Centre, Near Asaf Ali Road, Delhi',
    addressHi: 'दरियागंज कम्युनिटी सेंटर, आसफ अली रोड के पास, दिल्ली',
    lat: 28.6480,
    lon: 77.2410,
    operatingHours: '08:00 AM - 02:00 PM',
    facilities: ['Emergency IV Fluids', 'Free ORS & Paracetamol', 'Doctor on Duty', 'Air Conditioned Ward'],
    isVerified: true,
    isDemo: false,
    contactNumber: '+91-11-23274567',
    notes: 'Equipped with rapid cooling ice packs and emergency treatment for heat exhaustion.',
  },
  {
    id: 'jp-4',
    name: 'Lalbagh Banyan Shade Tree Rest Area',
    nameHi: 'लालबाग बरगद छांव विश्राम स्थल',
    category: 'shade',
    address: 'Outer Circle Ring Road, Civil Lines, Delhi',
    addressHi: 'आउटर सर्कल रिंग रोड, सिविल लाइंस, दिल्ली',
    lat: 28.6750,
    lon: 77.2220,
    operatingHours: 'Open Day & Night',
    facilities: ['Dense Banyan Canopy', 'Stone Benches', 'Bicycle / Cart Parking', 'Nearby Public Handpump'],
    isVerified: false,
    isDemo: true,
    notes: 'DEMO LOCATION: Naturally shaded green space popular with delivery gig riders.',
  },
  {
    id: 'jp-5',
    name: 'Red Fort Public Facility & Clean Drinking Tap',
    nameHi: 'लाल किला जन सुविधा एवं स्वच्छ पेयजल नल',
    category: 'facility',
    address: 'Netaji Subhash Marg, Opposite Digambar Jain Mandir, Delhi',
    addressHi: 'नेताजी सुभाष मार्ग, दिगंबर जैन मंदिर के सामने, दिल्ली',
    lat: 28.6562,
    lon: 77.2410,
    operatingHours: '05:30 AM - 09:30 PM',
    facilities: ['Clean Restrooms', 'Cold Water Dispenser', 'Seated Portico'],
    isVerified: true,
    isDemo: false,
    notes: 'Civic facility maintained with regular sanitary inspections.',
  },
  {
    id: 'jp-6',
    name: 'Ahmedabad Municipal Heat Hub - Navrangpura',
    nameHi: 'अहमदाबाद म्युनिसिपल हीट हब - नवरंगपुरा',
    category: 'cooling',
    address: 'Navrangpura Bus Terminal Plaza, Ahmedabad, Gujarat',
    addressHi: 'नवरंगपुरा बस टर्मिनल प्लाजा, अहमदाबाद, गुजरात',
    lat: 23.0365,
    lon: 72.5611,
    operatingHours: '09:00 AM - 08:00 PM',
    facilities: ['Misting Fans', 'Electrolyte Dispenser', 'First Aid Station'],
    isVerified: true,
    isDemo: false,
    contactNumber: '+91-79-26581234',
    notes: 'Ahmedabad Heat Action Plan official shelter for outdoor street vendors.',
  },
  {
    id: 'jp-7',
    name: 'Jaipur Walled City Civic Chabeel & Shade Canopy',
    nameHi: 'जयपुर चारदीवारी नागरिक छबील एवं छांव',
    category: 'water',
    address: 'Badi Chaupar, Near Hawa Mahal, Jaipur, Rajasthan',
    addressHi: 'बड़ी चौपड़, हवा महल के पास, जयपुर, राजस्थान',
    lat: 26.9239,
    lon: 75.8267,
    operatingHours: '07:00 AM - 09:00 PM',
    facilities: ['Earthen Pot (Matka) Cold Water', 'Cloth Awning Shade', 'Resting Benches'],
    isVerified: false,
    isDemo: true,
    notes: 'DEMO LOCATION: Community water jar point for heritage street vendors.',
  }
];

export function getStoredProfile(): WorkerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading profile from localStorage', e);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: WorkerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to localStorage', e);
  }
}

export function getStoredLanguage(): Language {
  try {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (lang === 'hi' || lang === 'en') return lang;
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (e) {
    console.error('Error saving language', e);
  }
}

export function getStoredSupportPoints(): SupportPoint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPORT_POINTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUPPORT_POINTS, JSON.stringify(INITIAL_SUPPORT_POINTS));
      return INITIAL_SUPPORT_POINTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUPPORT_POINTS;
  }
}

export function saveSupportPoint(point: SupportPoint): SupportPoint[] {
  const current = getStoredSupportPoints();
  const existingIdx = current.findIndex(p => p.id === point.id);
  let updated: SupportPoint[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = point;
  } else {
    updated = [point, ...current];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_POINTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating support points', e);
  }
  return updated;
}

export function deleteSupportPoint(id: string): SupportPoint[] {
  const current = getStoredSupportPoints();
  const filtered = current.filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_POINTS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting support point', e);
  }
  return filtered;
}

export function resetSupportPointsToDefault(): SupportPoint[] {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_POINTS, JSON.stringify(INITIAL_SUPPORT_POINTS));
  } catch (e) {
    console.error('Error resetting support points', e);
  }
  return INITIAL_SUPPORT_POINTS;
}
