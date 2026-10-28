import React from 'react';
import { MapPin, Clock, Tag, AlertTriangle, ExternalLink, Calendar, Compass } from 'lucide-react';
import VerificationBadge from '../ui/VerificationBadge';
import type { TourismRecord } from '../../types/khasi';

export interface TourismCardProps {
  record: TourismRecord;
}

const CATEGORY_METADATA: Record<string, { label: string; badgeClass: string }> = {
  tourism_destination: {
    label: 'Tourism Destination',
    badgeClass: 'bg-[#DAA520]/15 text-[#8B6508] border-[#DAA520]/40',
  },
  culture_and_etiquette: {
    label: 'Culture & Etiquette',
    badgeClass: 'bg-[#E97451]/15 text-[#C85A38] border-[#E97451]/40',
  },
  safety_and_emergency: {
    label: 'Safety & Emergency',
    badgeClass: 'bg-[#B22222]/15 text-[#B22222] border-[#B22222]/40',
  },
  transport: {
    label: 'Transport & Cabs',
    badgeClass: 'bg-[#1A1A1A]/10 text-[#1A1A1A] border-[#1A1A1A]/20',
  },
};

export const TourismCard: React.FC<TourismCardProps> = ({ record }) => {
  const categoryMeta = CATEGORY_METADATA[record.category] || {
    label: record.category.replace(/_/g, ' '),
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
  };

  return (
    <div className="rounded-3xl bg-[#FAF9F6] border border-[#E8E2D5] hover:border-[#DAA520] transition-all duration-300 p-6 flex flex-col justify-between shadow-silk hover:shadow-silk-lg group">
      <div className="space-y-4">
        {/* Header: Category Badge, Verification Status, and Location */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${categoryMeta.badgeClass} uppercase tracking-wider font-mono`}
          >
            {categoryMeta.label}
          </span>
          <VerificationBadge status={record.verification_status} size="xs" />
        </div>

        {/* Location Pin */}
        <div className="flex items-center gap-1.5 text-xs text-[#DAA520] font-semibold">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#E97451]" />
          <span className="truncate" title={record.location}>
            {record.location}
          </span>
        </div>

        {/* Title & Khasi Name */}
        <div>
          <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#B22222] transition-colors leading-snug">
            {record.title}
          </h3>
          {record.content.kha && (
            <div className="text-xs text-[#B22222] italic font-serif mt-1">
              {record.content.kha}
            </div>
          )}
        </div>

        {/* Summary Description */}
        <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-sans line-clamp-4">
          {record.content.en}
        </p>

        {/* Hours & Pricing Info Chips */}
        <div className="space-y-2 pt-2 border-t border-[#E8E2D5]/70 text-xs">
          {record.opening_hours && (
            <div className="flex items-start gap-2 text-[#1A1A1A]/75">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#DAA520] mt-0.5" />
              <span className="font-sans leading-tight">
                <strong className="font-semibold text-[#1A1A1A]">Hours:</strong> {record.opening_hours}
              </span>
            </div>
          )}

          {record.price_info && (
            <div className="flex items-start gap-2 text-[#1A1A1A]/75">
              <Tag className="w-3.5 h-3.5 shrink-0 text-[#E97451] mt-0.5" />
              <span className="font-sans leading-tight">
                <strong className="font-semibold text-[#1A1A1A]">Price &amp; Permits:</strong> {record.price_info}
              </span>
            </div>
          )}
        </div>

        {/* Safety Notes Callout */}
        {record.safety_notes && (
          <div className="p-3.5 rounded-2xl bg-[#B22222]/5 border border-[#B22222]/20 text-[11px] text-[#B22222] space-y-1">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B22222]" />
              <span>Cultural &amp; Terrain Safety Advisory</span>
            </div>
            <p className="text-[#1A1A1A]/80 leading-relaxed font-sans">
              {record.safety_notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer: Official Source & Last Reviewed Date */}
      <div className="mt-6 pt-4 border-t border-[#E8E2D5] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#1A1A1A]/60">
        <a
          href={record.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-[#B22222] hover:text-[#E97451] transition-colors group/link truncate max-w-[220px]"
          title={`View official record on ${record.source_name}`}
        >
          <Compass className="w-3.5 h-3.5 text-[#DAA520] shrink-0" />
          <span className="truncate">{record.source_name}</span>
          <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover/link:opacity-100" />
        </a>

        <div className="inline-flex items-center gap-1 text-[#1A1A1A]/50 font-mono">
          <Calendar className="w-3 h-3 text-[#DAA520]" />
          <span>Reviewed: {record.last_reviewed}</span>
        </div>
      </div>
    </div>
  );
};

export default TourismCard;
