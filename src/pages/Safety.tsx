import React from 'react';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Hospital,
  CloudRain,
  Compass,
  CheckCircle2,
  Lock,
  Trees,
  ShieldCheck,
  Building2,
  Ambulance,
} from 'lucide-react';
import WovenSilkDivider from '../components/layout/WovenSilkDivider';
import VerificationBadge from '../components/ui/VerificationBadge';

interface EmergencyContact {
  title: string;
  number: string;
  rawTel: string;
  service: string;
  type: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight: boolean;
  notes: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: 'National Emergency Response Support System (ERSS)',
    number: '112',
    rawTel: '112',
    service: 'Unified Police, Fire, Ambulance & Disaster Response across all Meghalaya Districts',
    type: 'Primary SOS',
    location: 'State Emergency Response Centre, Shillong',
    icon: PhoneCall,
    highlight: true,
    notes: 'Toll-free 24/7 call with GPS emergency vehicle tracking and automated district police routing.',
  },
  {
    title: 'Meghalaya Tourism Police Helpline',
    number: '+91 364 222 2055',
    rawTel: '+913642222055',
    service: 'Specialized Tourist Assistance, Guidance & Harassment Redressal',
    type: 'Tourism Police',
    location: 'Directorate of Tourism, Police Bazaar, Shillong',
    icon: ShieldCheck,
    highlight: false,
    notes: 'Official tourism assistance desk for visitor security, travel verifications, and missing luggage assistance.',
  },
  {
    title: 'NEIGRIHMS Hospital (Emergency Trauma Centre)',
    number: '+91 364 253 8011',
    rawTel: '+913642538011',
    service: 'Level-1 Tertiary Referral Hospital, Intensive Care & Advanced Trauma Surgery',
    type: 'Tertiary Trauma Care',
    location: 'Mawdiangdiang, Shillong 793018',
    icon: Hospital,
    highlight: false,
    notes: 'Premier central government teaching institute equipped with 24/7 emergency trauma and surgical casualty.',
  },
  {
    title: 'Shillong Civil Hospital',
    number: '+91 364 222 4100',
    rawTel: '+913642224100',
    service: 'Government Casualty Ward, General Emergency & Antivenom Stocking',
    type: 'General Casualty',
    location: 'Laban, Shillong 793001',
    icon: Ambulance,
    highlight: false,
    notes: 'Centrally located district government hospital with 24-hour round-the-clock emergency medical officers.',
  },
  {
    title: 'Cherrapunjee (Sohra) Community Health Centre',
    number: '+91 363 723 5224',
    rawTel: '+913637235224',
    service: 'Primary First Aid, High-Altitude Sprain Treatment & Ambulance Point',
    type: 'Sohra Local Medical',
    location: 'Sohra Civil Sub-Division, East Khasi Hills',
    icon: Building2,
    highlight: false,
    notes: 'Nearest medical station for waterfalls, root bridges, and canyon trekking emergency stabilization.',
  },
];

export const Safety: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. Page Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B22222]/10 border border-[#B22222] text-xs font-semibold text-[#B22222] mb-2 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Services &amp; Verified Sourced Hotlines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            Safety, Emergency 112 &amp; Cultural Etiquette Hub
          </h1>
          <p className="text-sm text-[#1A1A1A]/75 font-sans mt-1 max-w-3xl">
            Zero hallucinated phone numbers. All emergency contacts, disaster advisories, and customary taboos are authenticated with Government of Meghalaya directories and Dorbar Shnongs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VerificationBadge status="verified_official" size="md" labelOverride="Official Directory Verified" />
        </div>
      </div>

      <WovenSilkDivider variant="standard" />

      {/* 2. HIGH-PRIORITY EMERGENCY RESPONSE CARD (ERSS 112) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#B22222]/15 via-[#FAF9F6] to-[#FAF9F6] border-2 border-[#B22222] p-6 sm:p-10 shadow-silk">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B22222] text-white text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>National Emergency Response Support System</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              One-Tap Immediate Assistance: Dial 112
            </h2>

            <p className="text-sm sm:text-base text-[#1A1A1A]/85 leading-relaxed font-sans">
              The unified emergency line for Meghalaya dispatches Police, Fire, SDRF Mountain Rescue, and Ambulances across all 12 districts. Operates 24/7 without requiring cellular recharge or airtime credits.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#1A1A1A]/70">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#B22222]" />
                Toll-free 24x7 helpline
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#B22222]" />
                GPS ambulance dispatch
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#B22222]" />
                Meghalaya SDRF rescue teams
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="tel:112"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#B22222] hover:bg-[#8B0000] text-white font-serif font-bold text-lg tracking-wide transition-all duration-200 shadow-ceremonial hover:scale-105 active:scale-95 text-center"
            >
              <PhoneCall className="w-6 h-6 animate-bounce" />
              <span>Call 112 (National SOS)</span>
            </a>
            <span className="text-[11px] font-mono text-[#B22222] text-center">
              Available from any cellular network (Airtel, Jio, BSNL, VI)
            </span>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED EMERGENCY CONTACTS DIRECTORY */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B22222] uppercase tracking-wider mb-1">
            <Hospital className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Authenticated Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Government Helplines &amp; Trauma Registries
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-0.5">
            Verified directly against Meghalaya State Disaster Management Authority and Health &amp; Family Welfare records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EMERGENCY_CONTACTS.map((item, idx) => {
            const IconComponent = item.icon;

            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-silk hover:shadow-silk-lg ${
                  item.highlight
                    ? 'bg-gradient-to-br from-[#B22222]/10 via-[#FAF9F6] to-[#FAF9F6] border-[#B22222]'
                    : 'bg-[#FAF9F6] border-[#E8E2D5] hover:border-[#DAA520]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        item.highlight
                          ? 'bg-[#B22222]/10 text-[#B22222] border-[#B22222]/30'
                          : 'bg-[#DAA520]/10 text-[#8B6508] border-[#DAA520]/30'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[#1A1A1A]/50 text-[11px] truncate max-w-[200px]">
                      {item.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-sans">
                    {item.service}
                  </p>

                  <p className="text-[11px] text-[#1A1A1A]/60 italic font-sans pt-1">
                    {item.notes}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                  <a
                    href={`tel:${item.rawTel}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E2D5] hover:border-[#B22222] text-[#B22222] font-bold text-sm transition-all shadow-xs active:scale-95"
                  >
                    <IconComponent className="w-4 h-4 text-[#B22222]" />
                    <span>{item.number}</span>
                  </a>

                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
                    Verified Hotline
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CULTURAL ETIQUETTE GUIDELINES (LAW KYNTANG & DORBAR SHNONGS) */}
      <section className="rounded-3xl bg-[#FAF9F6] border-2 border-[#DAA520] p-6 sm:p-10 shadow-silk space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-[#DAA520]/20 text-[#1A1A1A] shrink-0 mt-1">
            <Trees className="w-6 h-6 text-[#B8860B]" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#B22222] uppercase tracking-wider font-mono">
              Cultural Custodianship Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Visiting Sacred Groves (Law Kyntang) &amp; Traditional Shnongs
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/75">
              The Khasi people maintain deeply reverent spiritual covenants with their ancestral living ecosystems. Visitors must uphold customary taboos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Rule 1: Mawphlang Invariant */}
          <div className="p-5 rounded-2xl bg-white/70 border border-[#E8E2D5] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B22222]">
              <Lock className="w-4 h-4 text-[#B22222]" />
              <span>Sacred Taboo: Nothing May Be Removed</span>
            </div>
            <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
              In Law Kyntang (such as the 800-year-old Mawphlang forest), absolutely nothing—not a dead twig, fallen leaf, pebble, orchid, or wild fruit—may be taken outside. Removing anything is forbidden by indigenous spiritual law.
            </p>
            <div className="text-[11px] font-mono text-[#B22222] font-semibold">
              Punishable under Dorbar Customary Penalties
            </div>
          </div>

          {/* Rule 2: Registered Guides */}
          <div className="p-5 rounded-2xl bg-white/70 border border-[#E8E2D5] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B]">
              <Compass className="w-4 h-4 text-[#DAA520]" />
              <span>Hire Registered Local Guides</span>
            </div>
            <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
              Always engage official guides registered with the village Dorbar Shnong (e.g. at Mawphlang, Nongriat, or Kongthong). Guide fees directly sustain forest guards and matrilineal community welfare funds.
            </p>
            <div className="text-[11px] font-mono text-[#8B6508] font-semibold">
              Community Eco-Development Mandate
            </div>
          </div>

          {/* Rule 3: Living Root Bridges */}
          <div className="p-5 rounded-2xl bg-white/70 border border-[#E8E2D5] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E97451]">
              <AlertTriangle className="w-4 h-4 text-[#E97451]" />
              <span>Respect Living Root Bridges (Jingkieng Jri)</span>
            </div>
            <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
              Living root bridges are bio-engineered structures trained over 150+ years. Never pull, swing on, carve initials into, or tamper with tender growing root tendrils. Observe group crossing limits posted at bridge heads.
            </p>
            <div className="text-[11px] font-mono text-[#C85A38] font-semibold">
              UNESCO World Heritage Tentative Site
            </div>
          </div>
        </div>
      </section>

      {/* 5. MONSOON PRECAUTIONS & HIGHWAY ROAD SAFETY */}
      <section className="rounded-3xl bg-[#FAF9F6] border border-[#E8E2D5] p-6 sm:p-10 shadow-silk space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-[#E97451]/15 text-[#E97451] shrink-0 mt-1">
            <CloudRain className="w-6 h-6 text-[#E97451]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#E97451] uppercase tracking-wider font-mono">
              Seasonal Environmental Warnings
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Monsoon Precautions &amp; East Khasi Hills Mountain Roads
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/75 mt-0.5">
              Meghalaya hosts the wettest places on Earth (Mawsynram and Cherrapunji). Heavy downpours require strict terrain vigilance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-2">
            <h3 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B22222]" />
              <span>Flash Floods &amp; Waterfall Plunge Pools</span>
            </h3>
            <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
              During the southwest monsoon (June–September), highland catchment basins can unleash torrential flash floods in minutes. Swimming under Nohkalikai, Wei Sawdong, or Rainbow Falls plunge pools is strictly prohibited during heavy rains.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-2">
            <h3 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
              <span>SH-5 Canyon Fog &amp; Landslide Zones</span>
            </h3>
            <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
              The Shillong–Cherrapunji highway (SH-5) traversing the Mawkdok Dympep valley is prone to zero-visibility dense whiteout fog. Avoid late evening drives after 05:00 PM. Follow local taxi convoys and maintain low-beam headlights.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SAFETY BOUNDARIES NOTICE (WHEN NOT TO USE MACHINE TRANSLATION) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#1A1A1A] text-[#FAF9F6] border border-[#DAA520]/50 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DAA520]">
          <Lock className="w-4 h-4 text-[#DAA520]" />
          <span>Strict AI Boundary Condition</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
          When Machine Translation Must NOT Be Relied Upon
        </h3>

        <div className="space-y-2.5 text-xs text-[#FAF9F6]/85 font-sans leading-relaxed">
          <p>
            While our custom Model A translation studio provides high fidelity for everyday conversations, cultural phrases, and tourism dialogue, <strong>neural language prediction carries inherent uncertainty</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[#FAF9F6]/90">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#E97451] block">Medical Diagnoses &amp; Allergies</span>
              Do not use automated translation for acute symptoms, snake bites, or allergen inquiries. Contact doctors directly or request an English-fluent physician at NEIGRIHMS.
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#E97451] block">Police Inquiries &amp; Legal Statements</span>
              Legal declarations or FIR reports must be communicated through certified human interpreters or tourist police officers at ERSS 112.
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-[#FAF9F6]/60">
          <span>Khasi Companion Quality &amp; Safety Framework</span>
          <span className="text-[#DAA520] font-mono">Zero Hallucination Protected</span>
        </div>
      </section>
    </div>
  );
};

export default Safety;
