import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import WovenSilkDivider from './WovenSilkDivider';
import ThemeToggle from '../ui/ThemeToggle';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#FAF9F6] relative overflow-hidden border-t-2 border-[#DAA520]">
      {/* Top Woven Silk Strip in Muga Gold & Ceremonial Red */}
      <WovenSilkDivider variant="standard" />

      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#DAA520]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#B22222]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 space-y-12">
        {/* Core Architectural Safety Principle Card */}
        <div className="rounded-2xl bg-white/5 border border-[#DAA520]/40 p-6 sm:p-8 backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#DAA520]/20 text-[#DAA520] flex-shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6 text-[#DAA520]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#B22222]/30 text-[#FAF9F6] text-[10px] font-mono tracking-widest uppercase mb-1.5 border border-[#B22222]/50">
                  <Lock className="w-2.5 h-2.5 text-[#DAA520]" />
                  <span>Invariant Safety Guarantee</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF9F6]">
                  &ldquo;Language datasets and tourism facts are strictly separated. Zero hallucinated translations, prices, or emergency contacts.&rdquo;
                </h3>
                <p className="text-xs text-[#FAF9F6]/70 font-sans mt-2 max-w-3xl leading-relaxed">
                  Translations are vetted by native Khasi speakers and published orthographic corpora. All trail access restrictions, homestay rates, taxi fares, and emergency numbers are fetched exclusively from verified Meghalaya authorities and village Dorbars.
                </p>
              </div>
            </div>

            <Link
              to="/system-status"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DAA520] hover:bg-[#DAA520]/80 text-[#1A1A1A] font-bold text-xs whitespace-nowrap transition-colors self-start md:self-center"
            >
              <span>View System Status</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Links & Cultural Heritage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border-2 border-[#DAA520] flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-[#B22222] rotate-45 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E97451]" />
                </div>
              </div>
              <span className="font-serif text-xl font-bold text-[#FAF9F6]">
                Khasi Companion
              </span>
            </div>

            <p className="text-xs text-[#FAF9F6]/75 leading-relaxed font-sans">
              Dedicated to the living heritage of Meghalaya&apos;s Khasi people (Ki Hynniewtrep). Combining respectful natural language technologies with responsible eco-tourism.
            </p>

            <div className="text-[11px] text-[#DAA520] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In Honor of Ri Bhoi Weavers &amp; Elders</span>
            </div>
          </div>

          {/* Col 2: Navigation Routes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DAA520]">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF9F6]/80 font-sans">
              <li>
                <Link to="/" className="hover:text-[#DAA520] transition-colors">
                  Home (Khublei Shibun)
                </Link>
              </li>
              <li>
                <Link to="/translate" className="hover:text-[#DAA520] transition-colors">
                  English – Khasi Translator
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-[#DAA520] transition-colors">
                  Explore Meghalaya Trails
                </Link>
              </li>
              <li>
                <Link to="/phrasebook" className="hover:text-[#DAA520] transition-colors">
                  Cultural Phrasebook &amp; Etiquette
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-[#DAA520] transition-colors">
                  Safety, SOS &amp; Helpline 112
                </Link>
              </li>
              <li>
                <Link to="/system-status" className="hover:text-[#DAA520] transition-colors">
                  System Status &amp; Integrity
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Khasi Heritage & Etiquette */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DAA520]">
              Cultural Etiquette
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF9F6]/80 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#B22222] font-bold">&bull;</span>
                <span>Honor the Dorbar Shnong (village community council) rules before entering remote villages.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B22222] font-bold">&bull;</span>
                <span>Never remove flora or stones from Law Kyntang (Sacred Groves).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B22222] font-bold">&bull;</span>
                <span>Support local Ri Bhoi Eri silk (Ryndia) weavers directly.</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Hotlines */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B22222]">
              Emergency Contacts
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF9F6]/80">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#FAF9F6] font-semibold">National SOS:</span>
                  <a href="tel:112" className="text-[#FAF9F6] font-mono font-bold bg-[#B22222] px-2 py-0.5 rounded text-[11px] hover:bg-[#E97451]">
                    112
                  </a>
                </div>
                <p className="text-[11px] text-[#FAF9F6]/60">Police, Ambulance, Fire</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#FAF9F6] font-semibold">Tourist Police:</span>
                  <a href="tel:03642222055" className="text-[#DAA520] font-mono text-[11px] hover:underline">
                    0364-2222055
                  </a>
                </div>
                <p className="text-[11px] text-[#FAF9F6]/60">Shillong Police HQ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Palette Reference, Theme Toggle & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF9F6]/60">
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle size="sm" showLabel={true} />
            <span className="hidden sm:inline text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span>Palette:</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#FAF9F6]/80">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FAF9F6] border border-black/30" title="Ryndia Off-White #FAF9F6" />
                Ryndia
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#DAA520]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DAA520]" title="Muga Gold #DAA520" />
                Muga
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#B22222]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B22222]" title="Ceremonial Red #B22222" />
                Ceremonial
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#E97451]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E97451]" title="Paila Coral #E97451" />
                Paila
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right font-sans">
            &copy; {CURRENT_YEAR} Khasi Companion. Culturally Authentic English–Khasi AI &amp; Tourism Initiative.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
