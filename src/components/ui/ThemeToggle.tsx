import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

export interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Theme (Ryndia Ivory)' : 'Switch to Dark Theme (Shillong Night)'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`inline-flex items-center gap-2 rounded-xl border border-[#DAA520]/60 hover:border-[#DAA520] transition-all duration-200 active:scale-95 shadow-xs hover:shadow-silk ${
        isDark
          ? 'bg-[#242424] text-[#DAA520] hover:bg-[#2C2C2C]'
          : 'bg-[#FAF9F6] text-[#1A1A1A] hover:bg-white'
      } ${sizeClasses[size]} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className={`${iconSizes[size]} text-[#DAA520] transition-transform duration-300 hover:rotate-45 animate-fadeIn`} />
        ) : (
          <Moon className={`${iconSizes[size]} text-[#1A1A1A] transition-transform duration-300 hover:-rotate-12 animate-fadeIn`} />
        )}
      </div>

      {showLabel && (
        <span className="font-sans font-semibold text-xs tracking-tight">
          {isDark ? 'Ryndia Ivory' : 'Shillong Night'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
