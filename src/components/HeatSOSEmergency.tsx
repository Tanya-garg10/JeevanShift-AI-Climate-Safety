import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  HeartPulse,
  ThermometerSnowflake,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Language, WorkerProfile, SupportPoint } from '../types';
import { translations } from '../i18n/translations';

interface HeatSOSEmergencyProps {
  profile: WorkerProfile;
  language: Language;
  supportPoints: SupportPoint[];
}

export const HeatSOSEmergency: React.FC<HeatSOSEmergencyProps> = ({
  profile,
  language,
  supportPoints,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [showCallConfirm, setShowCallConfirm] = useState(false);

  // Medical clinics nearby
  const clinics = supportPoints.filter((p) => p.category === 'clinic');

  // Emergency message template
  const emergencyMessage = language === 'hi'
    ? `आपातकाल (HeatSOS): मुझे अत्यधिक गर्मी से चक्कर आ रहे हैं और तबीयत बिगड़ रही है। मेरा वर्तमान स्थान: ${profile.locationName} (GPS: ${profile.lat}, ${profile.lon}) है। कृपया तुरंत मेरी मदद करें या 112 पर एम्बुलेंस भेजें!`
    : `EMERGENCY (HeatSOS): I am experiencing severe heat exhaustion/heat illness symptoms. My current location: ${profile.locationName} (GPS: ${profile.lat}, ${profile.lon}). Please call me immediately or dispatch medical assistance via 112!`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(emergencyMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCallEmergency = () => {
    setShowCallConfirm(true);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* High-Visibility Emergency Red Alert Banner */}
      <div className="rounded-3xl bg-rose-600 text-white p-6 sm:p-8 shadow-lg border border-rose-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
                HeatSOS · Emergency Assistance Protocol
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                {t.heatSOS.emergencyBanner}
              </h1>
            </div>
          </div>

          {/* 112 Direct Action Button */}
          <button
            onClick={handleCallEmergency}
            className="px-6 py-3.5 rounded-xl bg-white text-rose-700 font-extrabold text-sm shadow-md hover:bg-rose-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <PhoneCall className="w-5 h-5 text-rose-600" />
            <span>{t.heatSOS.callButtonText}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-black/20 border border-white/10 text-xs sm:text-sm font-semibold text-rose-50 leading-relaxed">
          ⚠️ {t.heatSOS.emergencyNotice}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-rose-100 pt-1 border-t border-rose-500/50">
          <span>{t.heatSOS.emergencyNumberLabel}: <strong>112</strong></span>
          <span>{t.heatSOS.emergencyNote}</span>
        </div>
      </div>

      {/* Quick Dispatch Message Template for Trusted Contacts */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-800" />
              <span>{t.heatSOS.quickShareTitle}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {t.heatSOS.quickShareSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMessage}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.actions.copied : t.heatSOS.copyTemplate}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.heatSOS.shareWhatsApp}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono leading-relaxed select-all">
          {emergencyMessage}
        </div>
      </div>

      {/* Side-by-Side: Heat Exhaustion vs. Heat Stroke */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-display">
          {t.heatSOS.symptomsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Heat Exhaustion Card (Amber Warning) */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.heatSOS.exhaustionTitle}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
                  Early Warning
                </span>
              </div>

              <div className="text-xs text-stone-700 space-y-2">
                <div className="font-semibold text-stone-900">Recognize the signs:</div>
                <ul className="list-disc pl-4 space-y-1">
                  {t.heatSOS.exhaustionSymptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-950 font-medium">
              <strong>Immediate Treatment:</strong> {t.heatSOS.exhaustionTreatment}
            </div>
          </div>

          {/* Heat Stroke Card (Red Alert) */}
          <div className="p-6 rounded-3xl bg-rose-50/70 border border-rose-300 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                <span className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  <span>{t.heatSOS.strokeTitle}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 uppercase animate-pulse">
                  Life Threatening
                </span>
              </div>

              <div className="text-xs text-stone-700 space-y-2">
                <div className="font-semibold text-stone-900">Extreme critical signs:</div>
                <ul className="list-disc pl-4 space-y-1 text-rose-950 font-medium">
                  {t.heatSOS.strokeSymptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-100/90 border border-rose-300 text-xs text-rose-950 font-semibold">
              <strong>Life-Saving Action:</strong> {t.heatSOS.strokeTreatment}
            </div>
          </div>

        </div>
      </div>

      {/* Standard Rapid On-Site Cooling Protocol */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
          <ThermometerSnowflake className="w-5 h-5 text-teal-700" />
          <span>{t.heatSOS.firstAidGuideTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="text-xs font-bold text-emerald-800">1. Instant Shade</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.heatSOS.step1}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="text-xs font-bold text-emerald-800">2. Water & Fan</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.heatSOS.step2}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="text-xs font-bold text-emerald-800">3. Safe Fluids</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.heatSOS.step3}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="text-xs font-bold text-emerald-800">4. Continuous Watch</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.heatSOS.step4}
            </p>
          </div>
        </div>
      </div>

      {/* Nearby Medical Clinics from Mapped Infrastructure */}
      {clinics.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>Nearby Urban Health Dispensaries & Clinics</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clinics.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-stone-800">{c.name}</div>
                  <div className="text-stone-500 mt-0.5">{c.address}</div>
                  <div className="text-emerald-800 font-semibold mt-1">🕒 {c.operatingHours}</div>
                </div>
                {c.contactNumber && (
                  <a
                    href={`tel:${c.contactNumber}`}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100 shrink-0"
                  >
                    Call Clinic
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Call Confirmation Dialog */}
      {showCallConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-rose-200">
            <div className="flex items-center gap-3 text-rose-600">
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-bold text-stone-900 font-display">
                Confirm Emergency 112 Call
              </h3>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              This will dial <strong>112 (India National Emergency Services)</strong> directly on your phone for emergency medical dispatch.
              <br /><br />
              Please stay on the line and clearly state:
              <br />
              1. Exact location: <strong>{profile.locationName}</strong>
              <br />
              2. Suspected Heat Stroke condition
              <br />
              3. Current consciousness state of the person.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCallConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <a
                href="tel:112"
                onClick={() => setShowCallConfirm(false)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Dial 112 Directly</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
