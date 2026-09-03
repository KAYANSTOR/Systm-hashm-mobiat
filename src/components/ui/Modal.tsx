import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** إغلاق عند الضغط على مفتاح Escape أو النقر على الخلفية. مفعّل افتراضيًا. */
  closeOnBackdrop?: boolean;
}

const sizeClass: Record<NonNullable<ModalProps['size']>, string> = {
  sm: '!max-w-sm',
  md: '!max-w-lg',
  lg: '!max-w-2xl',
  xl: '!max-w-4xl',
};

/**
 * Modal — نافذة منبثقة موحّدة.
 *
 * قبل هذا المكوّن، كانت كل شاشة (المصروفات، المبيعات، الصندوق، العملاء...)
 * تُعيد كتابة نفس التركيبة (خلفية + بطاقة + زر إغلاق) يدويًا، بقيم مختلفة
 * قليلاً في كل مرة (z-40 هنا و z-50 هناك، rounded-2xl هنا و rounded-3xl هناك،
 * وبعضها بدون إغلاق بـ Escape). هذا المكوّن يوحّد ذلك في مكان واحد،
 * ويضيف سلوكًا كان مفقودًا في أغلب النوافذ: الإغلاق بمفتاح Escape.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay no-print"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn('modal-content', sizeClass[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-50"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
