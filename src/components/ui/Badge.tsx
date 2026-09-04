import React from "react";
import { cn } from "../../lib/utils";

type Tone = "success" | "danger" | "warning" | "neutral" | "brand" | "info";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  danger: "bg-rose-50 text-rose-700 border-rose-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  brand: "bg-teal-50 text-teal-700 border-teal-100",
  info: "bg-blue-50 text-blue-700 border-blue-100",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
