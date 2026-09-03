import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  outline: 'btn-outline',
  // "ghost" has no matching global class yet — defined inline to stay consistent
  // with the rounded/bold/active-scale language used by every other button.
  ghost: 'flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap',
};

const sizeClass: Record<Size, string> = {
  sm: 'text-xs !px-3 !py-2',
  md: '',
  lg: 'text-base !px-6 !py-3.5',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  /** Icon placed after the label instead of before it (useful for RTL "back" chevrons). */
  iconAfter?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Button — واجهة موحّدة لكل الأزرار في التطبيق.
 * يبني فوق أصناف btn-* الموجودة في index.css حتى لا يتغيّر الشكل الحالي،
 * لكنه يضيف: حالة تحميل، أيقونة، عرض كامل، ودعم TypeScript كامل،
 * بدل تكرار نفس className الطويل يدويًا في كل صفحة.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconAfter,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          variantClass[variant],
          sizeClass[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-60 cursor-not-allowed active:scale-100',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon
        )}
        {children && <span>{children}</span>}
        {!loading && iconAfter}
      </button>
    );
  }
);
Button.displayName = 'Button';
