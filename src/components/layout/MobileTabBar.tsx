import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Languages, Compass, BookOpen, ShieldAlert, Activity, GraduationCap } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Learn', path: '/learn', icon: GraduationCap },
    { name: 'Translate', path: '/translate', icon: Languages },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Phrases', path: '/phrasebook', icon: BookOpen },
    { name: 'Safety', path: '/safety', icon: ShieldAlert, highlight: true },
    { name: 'Status', path: '/system-status', icon: Activity },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#E8E2D5] px-2 py-1 shadow-lg transition-transform"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 sm:px-2 rounded-xl transition-all duration-150 relative min-w-[46px] sm:min-w-[54px] ${
                  isActive
                    ? 'text-[#B22222]'
                    : 'text-[#1A1A1A]/70 hover:text-[#E97451]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1 rounded-lg transition-transform ${
                      isActive ? 'scale-110' : ''
                    } ${
                      tab.highlight && !isActive
                        ? 'text-[#B22222]'
                        : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.highlight && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#B22222] ring-2 ring-[#FAF9F6]" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] tracking-tight mt-0.5 ${
                      isActive ? 'font-bold text-[#B22222]' : 'font-medium'
                    }`}
                  >
                    {tab.name}
                  </span>
                  {isActive && (
                    <span
                      className="absolute -top-1 w-6 h-1 bg-[#B22222] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
