import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  MapPin,
  CalendarCheck,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Send,
  Building,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { Language, SupportPoint, WeatherCondition, SupportCategory } from '../types';
import { translations } from '../i18n/translations';

interface EmployerCommunityDashboardProps {
  supportPoints: SupportPoint[];
  weather: WeatherCondition;
  language: Language;
  onSavePoint: (point: SupportPoint) => void;
  onDeletePoint: (id: string) => void;
  onResetPoints: () => void;
}

export const EmployerCommunityDashboard: React.FC<EmployerCommunityDashboardProps> = ({
  supportPoints,
  weather,
  language,
  onSavePoint,
  onDeletePoint,
  onResetPoints,
}) => {
  const t = translations[language];

  // Aggregated cohort data for demo (avoid exposing individual PII)
  const workerCohorts = [
    {
      trade: 'Street Food & Fruit Vendors',
      tradeHi: 'रेहड़ी-पटरी फल व खाद्य विक्रेता',
      count: 42,
      riskLevel: 'High',
      recommendation: 'Encourage morning sales 7-11 AM; supply portable thermal umbrella covers.',
      recommendationHi: 'सुबह 7-11 बजे बिक्री बढ़ाएं; पोर्टेबल छाता कवर उपलब्ध कराएं।',
    },
    {
      trade: 'Delivery Riders (Quick-Commerce)',
      tradeHi: 'डिलीवरी राइडर्स (क्विक-कॉमर्स)',
      count: 128,
      riskLevel: 'Extreme',
      recommendation: 'Pause order-dispatch SLA penalties from 12:30 PM to 3:30 PM.',
      recommendationHi: 'दोपहर 12:30 से 3:30 तक समय पर डिलीवरी के पेनल्टी नियम रोकें।',
    },
    {
      trade: 'Daily Wage Construction Labour',
      tradeHi: 'दैनिक निर्माण मजदूर',
      count: 85,
      riskLevel: 'Extreme',
      recommendation: 'Enforce mandatory 20-min shade rest every 45 min; stop outdoor scaffolding.',
      recommendationHi: 'हर 45 मिनट में 20 मिनट का अनिवार्य विश्राम दें; मचान का कार्य रोकें।',
    },
    {
      trade: 'Logistics & Auto Transport',
      tradeHi: 'लॉजिस्टिक्स व ऑटो चालक',
      count: 64,
      riskLevel: 'Moderate',
      recommendation: 'Provide cooled resting points and ice-water jars at major transit hubs.',
      recommendationHi: 'प्रमुख चौराहों पर ठंडे पानी के मटके और विश्राम स्थल उपलब्ध कराएं।',
    },
  ];

  // Community Point CRUD modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<SupportPoint | null>(null);
  const [pointName, setPointName] = useState('');
  const [pointCategory, setPointCategory] = useState<SupportCategory>('water');
  const [pointAddress, setPointAddress] = useState('');
  const [pointHours, setPointHours] = useState('08:00 AM - 08:00 PM');
  const [pointFacilities, setPointFacilities] = useState('Drinking Water, Shade');
  const [pointIsVerified, setPointIsVerified] = useState(true);

  // Broadcast alert simulation
  const [alertBroadcasted, setAlertBroadcasted] = useState(false);

  const handleOpenAdd = () => {
    setEditingPoint(null);
    setPointName('');
    setPointCategory('water');
    setPointAddress('');
    setPointHours('08:00 AM - 08:00 PM');
    setPointFacilities('Clean Drinking Water, Resting Benches');
    setPointIsVerified(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (pt: SupportPoint) => {
    setEditingPoint(pt);
    setPointName(pt.name);
    setPointCategory(pt.category);
    setPointAddress(pt.address);
    setPointHours(pt.operatingHours);
    setPointFacilities(pt.facilities.join(', '));
    setPointIsVerified(pt.isVerified);
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointName.trim() || !pointAddress.trim()) return;

    const facilitiesArray = pointFacilities
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const pointToSave: SupportPoint = {
      id: editingPoint ? editingPoint.id : `jp-${Date.now()}`,
      name: pointName,
      nameHi: pointName,
      category: pointCategory,
      address: pointAddress,
      addressHi: pointAddress,
      lat: editingPoint ? editingPoint.lat : 28.65 + (Math.random() - 0.5) * 0.05,
      lon: editingPoint ? editingPoint.lon : 77.23 + (Math.random() - 0.5) * 0.05,
      operatingHours: pointHours,
      facilities: facilitiesArray.length > 0 ? facilitiesArray : ['Water Station'],
      isVerified: pointIsVerified,
      isDemo: !pointIsVerified,
    };

    onSavePoint(pointToSave);
    setModalOpen(false);
  };

  const handleTriggerBroadcast = () => {
    setAlertBroadcasted(true);
    setTimeout(() => setAlertBroadcasted(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>{t.community.title}</span>
            <span>·</span>
            <span>Coordinator & Employer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display mt-0.5">
            {language === 'hi' ? 'सामुदायिक संसाधन एवं सुरक्षा प्रबंधन' : 'Heat Action Plan Coordination Portal'}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            {t.community.subtitle}
          </p>
        </div>

        {/* Emergency Broadcast Trigger */}
        <button
          onClick={handleTriggerBroadcast}
          className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-2xs shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Heat Red-Alert to Fleets</span>
        </button>
      </div>

      {alertBroadcasted && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>Heatwave Red-Alert advisory broadcasted to 319 active registered workers!</span>
          </div>
          <span className="text-[11px] opacity-80">Sent at {new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* Aggregate Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>{t.community.workersUnderAdvisory}</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tabular-nums">
            319 Workers
          </div>
          <div className="text-[11px] text-stone-500">
            Across 4 key vulnerable trade sectors
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>{t.community.activeSupportPoints}</span>
            <MapPin className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tabular-nums">
            {supportPoints.length} Points
          </div>
          <div className="text-[11px] text-stone-500">
            {supportPoints.filter(p => p.isVerified).length} verified civic kiosks
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-rose-800 text-xs">
            <span>{t.community.highRiskWorkers}</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-950 font-display tabular-nums">
            213 in Red Zone
          </div>
          <div className="text-[11px] text-rose-800/80">
            Current heat index &gt; 42°C
          </div>
        </div>

      </div>

      {/* Fleet Shift & Safety Advisories */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-800" />
          <span>{t.community.recommendationsTitle}</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.community.recommendation1}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.community.recommendation2}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.community.recommendation3}</span>
          </div>
        </div>
      </div>

      {/* Aggregated Worker Cohorts Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 font-display">
            {t.community.workerCohortTableTitle}
          </h3>
          <span className="text-xs text-stone-400">Aggregated View (Zero Individual PII)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">{t.community.cohortTrade}</th>
                <th className="py-3 px-4">{t.community.cohortCount}</th>
                <th className="py-3 px-4">Thermal Danger</th>
                <th className="py-3 px-4">{t.community.cohortShiftStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {workerCohorts.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {language === 'hi' ? row.tradeHi : row.trade}
                  </td>
                  <td className="py-3 px-4 tabular-nums font-medium">
                    {row.count} workers
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        row.riskLevel === 'Extreme'
                          ? 'bg-rose-100 text-rose-800'
                          : row.riskLevel === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {language === 'hi' ? row.recommendationHi : row.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community Support Points CRUD Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-800" />
              <span>{t.community.supportPointsManagement}</span>
            </h3>
            <p className="text-xs text-stone-500">
              Manage community kiosks, water stations, and cooling centers. Changes persist live in localStorage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetPoints}
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset to default seed locations"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.community.addPointBtn}</span>
            </button>
          </div>
        </div>

        {/* Support Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {supportPoints.map((pt) => (
            <div
              key={pt.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-stone-900 leading-snug">
                    {pt.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                      pt.isVerified
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {pt.isVerified ? 'VERIFIED' : 'DEMO'}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">
                  {pt.address}
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold">
                  🕒 {pt.operatingHours}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                <button
                  onClick={() => handleOpenEdit(pt)}
                  className="text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t.community.editPoint}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(t.community.deleteConfirm)) {
                      onDeletePoint(pt.id);
                    }
                  }}
                  className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.community.deletePoint}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Point Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 font-display">
              {editingPoint ? 'Edit Support Point' : t.jeeveanPoints.addNewTitle}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Facility / Kiosk Name</label>
                <input
                  type="text"
                  required
                  value={pointName}
                  onChange={(e) => setPointName(e.target.value)}
                  placeholder="e.g., Sis Ganj Sahib Chabeel Water Kiosk"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Category</label>
                  <select
                    value={pointCategory}
                    onChange={(e) => setPointCategory(e.target.value as SupportCategory)}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="water">💧 Drinking Water (जल)</option>
                    <option value="shade">🌳 Shaded Rest (छांव)</option>
                    <option value="cooling">❄️ Air-Cooled Center (शीत केंद्र)</option>
                    <option value="clinic">🏥 Health Clinic (चिकित्सा)</option>
                    <option value="facility">🚻 Public Restroom (सुविधा)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Operating Hours</label>
                  <input
                    type="text"
                    value={pointHours}
                    onChange={(e) => setPointHours(e.target.value)}
                    placeholder="e.g. 06:00 AM - 10:00 PM"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Address / Location Landmark</label>
                <input
                  type="text"
                  required
                  value={pointAddress}
                  onChange={(e) => setPointAddress(e.target.value)}
                  placeholder="e.g., Gate 2, Metro Station, Old Delhi"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Facilities (comma-separated)</label>
                <input
                  type="text"
                  value={pointFacilities}
                  onChange={(e) => setPointFacilities(e.target.value)}
                  placeholder="e.g., Free Cold Water, ORS Packets, Seating"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is-verified-chk"
                  checked={pointIsVerified}
                  onChange={(e) => setPointIsVerified(e.target.checked)}
                  className="accent-emerald-800 rounded"
                />
                <label htmlFor="is-verified-chk" className="text-xs text-stone-700 cursor-pointer">
                  Mark as Verified Partner Facility (uncheck for DEMO location)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg cursor-pointer shadow-xs"
                >
                  Save Support Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
