import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-YE", {
    style: "currency",
    currency: "YER",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format number with thousand separators (no currency symbol). */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("ar-YE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date | any): string {
  let dateObj = date;
  if (date && typeof date.toDate === "function") {
    dateObj = date.toDate();
  } else if (typeof date === "string" || typeof date === "number") {
    dateObj = new Date(date);
  }
  return new Intl.DateTimeFormat("ar-YE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Adaptive font-size classes for large financial figures.
 * Prevents overflow on mobile when amounts grow into millions+.
 */
export function adaptiveValueClass(value: number | string, base = "text-3xl"): string {
  const n =
    typeof value === "string"
      ? Number(String(value).replace(/[^\d.-]/g, ""))
      : value;
  if (!Number.isFinite(n)) return base;
  const abs = Math.abs(n);
  if (abs >= 100_000_000) return "text-xl sm:text-2xl";
  if (abs >= 10_000_000) return "text-2xl sm:text-3xl";
  if (abs >= 1_000_000) return "text-2xl sm:text-4xl";
  if (abs >= 100_000) return "text-3xl sm:text-4xl";
  return base;
}
