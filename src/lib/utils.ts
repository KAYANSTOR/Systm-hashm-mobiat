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
