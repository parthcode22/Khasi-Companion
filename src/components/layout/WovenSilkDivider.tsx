import React from 'react';

interface WovenSilkDividerProps {
  className?: string;
  variant?: 'standard' | 'subtle' | 'compact';
}

/**
 * WovenSilkDivider
 * Renders a subtle, geometric traditional Khasi Jainsem / Ryndia inspired border pattern
 * using #DAA520 (Muga Gold), #B22222 (Ceremonial Red), and #E97451 (Paila Coral).
 */
export const WovenSilkDivider: React.FC<WovenSilkDividerProps> = ({
  className = '',
  variant = 'standard',
}) => {
  const height = variant === 'compact' ? 8 : variant === 'subtle' ? 10 : 14;
  const opacity = variant === 'subtle' ? 'opacity-70' : 'opacity-100';

  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`w-full overflow-hidden select-none ${opacity} ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat-x"
        height={height}
      >
        <defs>
          <pattern
            id={`khasi-silk-pattern-${variant}`}
            width="36"
            height={height}
            patternUnits="userSpaceOnUse"
          >
            {/* Top Muga Gold thread line */}
            <line x1="0" y1="1" x2="36" y2="1" stroke="#DAA520" strokeWidth="1" strokeDasharray="3,1" />

            {/* Geometric Khasi Jainsem diamond motif in Ceremonial Red */}
            <polygon
              points={`18,2 26,${height / 2} 18,${height - 2} 10,${height / 2}`}
              fill="#B22222"
              fillOpacity="0.85"
            />

            {/* Central Paila Coral bead core */}
            <circle
              cx="18"
              cy={height / 2}
              r={height > 10 ? 2 : 1.2}
              fill="#E97451"
            />

            {/* Flanking Muga Gold triangular weave stitches */}
            <polygon
              points={`0,${height / 2} 4,2 8,${height / 2}`}
              fill="#DAA520"
              fillOpacity="0.75"
            />
            <polygon
              points={`28,${height / 2} 32,2 36,${height / 2}`}
              fill="#DAA520"
              fillOpacity="0.75"
            />
            <polygon
              points={`0,${height / 2} 4,${height - 2} 8,${height / 2}`}
              fill="#E97451"
              fillOpacity="0.5"
            />
            <polygon
              points={`28,${height / 2} 32,${height - 2} 36,${height / 2}`}
              fill="#E97451"
              fillOpacity="0.5"
            />

            {/* Bottom Muga Gold thread line */}
            <line
              x1="0"
              y1={height - 1}
              x2="36"
              y2={height - 1}
              stroke="#DAA520"
              strokeWidth="1"
              strokeDasharray="3,1"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#khasi-silk-pattern-${variant})`}
        />
      </svg>
    </div>
  );
};

export default WovenSilkDivider;
