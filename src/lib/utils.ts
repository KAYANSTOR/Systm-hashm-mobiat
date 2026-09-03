import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-YE', {
    style: 'currency',
    currency: 'YER',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * يرجع صنف Tailwind لحجم خط مناسب حسب عدد خانات الرقم، حتى لا تكسر
 * الأرقام المالية الكبيرة (بالريال اليمني غالبًا 6-9 خانات) تخطيط
 * البطاقة التي تُعرض بداخلها. استُخدمت هذه الدالة بدل تكرار نفس
 * المنطق يدويًا (أو تجاهله) في كل شاشة تعرض قيمة مالية بارزة.
 */
export function adaptiveValueClass(
  value: string | number,
  sizes: [huge: string, large: string, normal: string] = ['text-lg', 'text-xl', 'text-2xl']
): string {
  const len = String(value).replace(/[^\d]/g, '').length;
  if (len > 12) return sizes[0];
  if (len > 8) return sizes[1];
  return sizes[2];
}

export function formatDate(date: string | Date | any): string {
  // Handle Firestore Timestamps
  let dateObj = date;
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  }
  return new Intl.DateTimeFormat('ar-YE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}
