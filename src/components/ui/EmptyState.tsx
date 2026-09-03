import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * EmptyState — حالة "لا توجد بيانات" موحّدة الشكل في كل شاشات النظام.
 * قبل هذا المكوّن كانت كل صفحة (لوحة التحكم، المبيعات، السندات، المخزون...)
 * تكتب نفس التركيبة (أيقونة رمادية + نص + padding) يدويًا بأرقام وألوان
 * مختلفة قليلاً في كل مرة — وهو أصل مشكلة fix-empty-states.cjs.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('py-12 px-4 flex flex-col items-center text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
        {icon ?? <Inbox className="w-8 h-8" />}
      </div>
      <p className="text-slate-600 font-bold">{title}</p>
      {description && (
        <p className="text-slate-400 text-sm mt-1.5 max-w-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
