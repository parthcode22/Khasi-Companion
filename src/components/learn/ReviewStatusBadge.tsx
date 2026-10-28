import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import type { ReviewStatus } from '../../types/learn';

interface ReviewStatusBadgeProps {
  status: ReviewStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({
  status,
  size = 'sm',
  showLabel = true,
}) => {
  const isVerified = status === 'verified';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-full border transition-colors ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      } ${
        isVerified
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
          : 'bg-[#E97451]/10 dark:bg-[#E97451]/20 text-[#C85A38] dark:text-[#F39C7F] border-[#E97451]/30'
      }`}
      title={
        isVerified
          ? 'Content verified by Khasi educator'
          : 'Early release prototype word'
      }
    >
      {isVerified ? (
        <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      ) : (
        <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      )}
      {showLabel && (
        <span className="font-semibold">
          {isVerified ? 'Verified' : 'PROTOTYPE WORD'}
        </span>
      )}
    </span>
  );
};

export default ReviewStatusBadge;
