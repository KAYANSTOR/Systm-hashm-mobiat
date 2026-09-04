import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn, formatNumber, adaptiveValueClass } from "../../lib/utils";

export interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  unit = "ر.ي",
  subtitle,
  icon,
  onClick,
  className,
  valueClassName,
}: StatCardProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 flex flex-col items-end text-right w-full",
        onClick && "cursor-pointer hover:bg-slate-50 transition-colors active:scale-[0.98]",
        className
      )}
    >
      <div className="flex items-center justify-between w-full mb-3 text-slate-500">
        {onClick ? <ChevronLeft className="w-4 h-4" /> : <span />}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-700">{title}</span>
          {icon && (
            <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500">{icon}</div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "font-black text-slate-800 mb-2 flex items-baseline gap-1 tabular-nums",
          adaptiveValueClass(value, "text-2xl"),
          valueClassName
        )}
      >
        <span className="text-sm font-bold text-slate-500">{unit}</span>
        <span>{formatNumber(value)}</span>
      </div>

      {subtitle && (
        <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-xl text-xs font-bold">
          {subtitle}
        </div>
      )}
    </Comp>
  );
}

export default StatCard;
