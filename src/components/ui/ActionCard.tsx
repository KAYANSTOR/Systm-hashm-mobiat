import React from 'react';
import { cn } from '../../lib/utils';

export interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  className?: string;
}

/**
 * ActionCard — بطاقة إجراء سريع (فاتورة جديدة، سند قبض...).
 * كانت معرَّفة محليًا داخل Dashboard.tsx فقط رغم أن نفس النمط البصري
 * يتكرر في قائمة الإجراءات السريعة (FAB) بـ Layout.tsx بتنسيق مختلف قليلاً.
 * نقلها هنا يجعلها متاحة لأي شاشة أخرى بنفس الشكل الموحّد.
 */
export function ActionCard({ icon, title, onClick, className }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-white rounded-[20px] p-6 shadow-sm border border-slate-100/60 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-colors active:scale-95',
        className
      )}
    >
      <div className="w-14 h-14 bg-teal-50/50 rounded-full flex items-center justify-center border border-teal-100/50">
        {icon}
      </div>
      <span className="font-bold text-slate-800 text-sm">{title}</span>
    </button>
  );
}
