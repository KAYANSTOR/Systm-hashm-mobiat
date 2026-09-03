import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

const variantClass: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-blue-50 text-blue-700',
  neutral: 'bg-slate-100 text-slate-600',
  brand: 'bg-teal-50 text-teal-700',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

/**
 * Badge — شارة صغيرة لعرض حالة (مدفوع، مستحق، متأخر، مسودة...).
 * الهدف: مكان واحد يقرر فيه لون كل حالة، بدل أن يقرر كل مطوّر/كل صفحة
 * لونها الخاص لنفس المعنى (وهذا بالضبط ما كان يحدث سابقًا: bg-emerald-50
 * تارة و bg-green-50 تارة أخرى لنفس الحالة "مدفوع" في صفحات مختلفة).
 */
export function Badge({ variant = 'neutral', icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap',
        variantClass[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}

/** خرائط جاهزة للحالات المحاسبية الشائعة في النظام — تُستخدم بدل تكرار المنطق في كل صفحة. */
export const paymentStatusVariant: Record<'paid' | 'partial' | 'due' | 'overdue' | 'draft', BadgeVariant> = {
  paid: 'success',
  partial: 'info',
  due: 'warning',
  overdue: 'danger',
  draft: 'neutral',
};

export const paymentStatusLabel: Record<'paid' | 'partial' | 'due' | 'overdue' | 'draft', string> = {
  paid: 'مدفوعة',
  partial: 'مدفوعة جزئيًا',
  due: 'مستحقة',
  overdue: 'متأخرة',
  draft: 'مسودة',
};
