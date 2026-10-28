import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PhoneCall, Compass, Languages, BookOpen, ShieldAlert, Activity, Home, GraduationCap } from 'lucide-react';
import WovenSilkDivider from './WovenSilkDivider';
import ThemeToggle from '../ui/ThemeToggle';
import { checkSystemHealth } from '../../services/api';

export const Navbar: React.FC = () => {
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    checkSystemHealth().then((health) => {
      if (isMounted) {
        setIsLiveBackend(Boolean(health.is_live_backend));
      }
    });

    const handleBackendStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ isLive?: boolean }>;
      if (typeof customEvent.detail?.isLive === 'boolean') {
        setIsLiveBackend(customEvent.detail.isLive);
      }
    };

    window.addEventListener('khasi-backend-status-updated', handleBackendStatus);
    return () => {
      isMounted = false;
      window.removeEventListener('khasi-backend-status-updated', handleBackendStatus);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Learn Khasi', path: '/learn', icon: GraduationCap },
    { name: 'Translate', path: '/translate', icon: Languages },
    { name: 'Explore Meghalaya', path: '/explore', icon: Compass },
    { name: 'Phrasebook', path: '/phrasebook', icon: BookOpen },
    { name: 'Safety & 112', path: '/safety', icon: ShieldAlert },
    { name: 'System Status', path: '/system-status', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0">
            {/* Traditional Geometric Khasi Diamond Emblem */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#FAF9F6] to-[#E8E2D5] border-2 border-[#DAA520] flex items-center justify-center shadow-sm group-hover:border-[#B22222] transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-[#DAA520]/10 group-hover:bg-[#B22222]/10 transition-colors" />
              {/* Geometric Diamond Emblem */}
              <div className="w-5 h-5 border-2 border-[#B22222] rotate-45 flex items-center justify-center bg-[#FAF9F6] shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#E97451]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#B22222] transition-colors">
                  Khasi Companion
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#DAA520]/20 text-[#1A1A1A] font-semibold border border-[#DAA520]/40">
                  Ri Bhoi Silk
                </span>
              </div>
              <div className="text-[11px] text-[#1A1A1A]/70 font-sans tracking-wide">
                Meghalaya Language &amp; Sourced Tourism Guide
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#B22222] font-semibold'
                        : 'text-[#1A1A1A]/80 hover:text-[#E97451] hover:bg-[#E8E2D5]/30'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#B22222]' : 'text-[#1A1A1A]/60'}`} />
                      <span>{item.name}</span>
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#B22222] rounded-full"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Status Indicator, SOS 112 Pill, and Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark & White Theme Toggle */}
            <ThemeToggle size="sm" showLabel={false} />

            {/* Dynamic API Mode Indicator */}
            {isLiveBackend ? (
              <div
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-400 text-xs shadow-xs"
                title="Live FastAPI GPU Connection Active"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                <span className="text-emerald-900 font-medium text-[11px] tracking-wide">
                  API: <strong className="font-bold text-emerald-950">Live GPU</strong>
                </span>
              </div>
            ) : (
              <div
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[#DAA520]/60 text-xs shadow-xs"
                title="Client-Side Verified Sourced Fallback Mode"
              >
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[#1A1A1A] font-medium text-[11px] tracking-wide">
                  API: <strong className="font-semibold text-[#1A1A1A]">Sourced Fallback</strong>
                </span>
              </div>
            )}

            {/* Quick Access SOS 112 Pill Button */}
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#B22222] hover:bg-[#E97451] text-[#FAF9F6] text-xs font-bold tracking-wide shadow-ceremonial transition-all duration-200 hover:scale-105 active:scale-95"
              title="Call National Emergency 112"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 112</span>
            </a>
          </div>
        </div>
      </div>

      {/* Subtle Woven Silk Accent Bar */}
      <WovenSilkDivider variant="compact" />
    </header>
  );
};

export default Navbar;
