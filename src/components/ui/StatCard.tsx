import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn, adaptiveValueClass } from '../../lib/utils';

export interface StatCardProps {
  label: string;
  /** القيمة الرقمية جاهزة كنص (استخدمي formatCurrency ثم أزيلي رمز العملة إن رغبتِ بوضعه في currencySuffix). */
  value: string | number;
  currencySuffix?: string;
  icon?: React.ReactNode;
  iconBgClassName?: string;
  badgeLabel?: React.ReactNode;
  badgeClassName?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * StatCard — بطاقة مؤشر رقمي (مبيعات اليوم، رصيد الصندوق، مستحقات...).
 *
 * هذا المكوّن مستخرج من التركيبة المكرَّرة يدويًا في Dashboard.tsx، لكنه
 * يعالج مشكلة كانت السبب المباشر لوجود fix-huge-numbers.cjs و fix-huge.cjs
 * في المستودع: الأرقام المالية الكبيرة (ملايين الريال اليمني) كانت تكسر
 * تخطيط البطاقة. الحل هنا بنيوي وليس ترقيعًا: حجم خط الرقم يتقلّص تلقائيًا
 * كلما زاد عدد الخانات، والحاوية تسمح بالالتفاف (min-w-0 + flex-wrap)
 * بدل أن تفيض خارج حدود البطاقة.
 */
export function StatCard({
  label,
  value,
  currencySuffix,
  icon,
  iconBgClassName = 'bg-blue-50',
  badgeLabel,
  badgeClassName = 'bg-teal-50 text-teal-700',
  onClick,
  className,
}: StatCardProps) {
  const valueStr = String(value);
  // كلما زاد عدد الخانات قلّ حجم الخط — يمنع فيضان الأرقام الكبيرة بنيويًا.
  const valueSizeClass = adaptiveValueClass(valueStr);

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 flex flex-col items-end min-w-0',
        onClick && 'cursor-pointer hover:bg-slate-50 transition-colors active:scale-95',
        className
      )}
    >
      <div className="flex items-center justify-between w-full mb-4 text-slate-500">
        {onClick && <ChevronLeft className="w-4 h-4 shrink-0" />}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-slate-700 truncate">{label}</span>
          {icon && (
            <div className={cn('p-1.5 rounded-lg shrink-0', iconBgClassName)}>{icon}</div>
          )}
        </div>
      </div>

      <div
        className={cn(
          'font-black text-slate-800 mb-2 flex items-baseline gap-1 flex-wrap justify-end w-full min-w-0',
          valueSizeClass
        )}
      >
        {currencySuffix && (
          <span className="text-sm font-bold text-slate-500 shrink-0">{currencySuffix}</span>
        )}
        <span className="tabular-nums break-all">{valueStr}</span>
      </div>

      {badgeLabel && (
        <div className={cn('px-3 py-1 rounded-xl text-xs font-bold', badgeClassName)}>
          {badgeLabel}
        </div>
      )}
    </div>
  );
}
