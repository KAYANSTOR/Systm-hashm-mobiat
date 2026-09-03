import React, { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import "./StatementFilters.css";

export type Party = {
  id: string;
  name: string;
  type?: string;
  phone?: string;
};

type Props = {
  customers: Party[];
  suppliers: Party[];
  initialFrom?: Date;
  initialTo?: Date;
  initialPartyId?: string;
  onContinue?: (value: {
    from: Date;
    to: Date;
    party: Party | null;
  }) => void;
};

export const months = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export function dateLabel(date: Date) {
  return new Intl.DateTimeFormat("ar-YE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function StatementFilters({
  customers,
  suppliers,
  initialFrom = new Date(),
  initialTo = new Date(),
  initialPartyId,
  onContinue,
}: Props) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [party, setParty] = useState<Party | null>(
    [...customers, ...suppliers].find((x) => x.id === initialPartyId) ?? null
  );

  const [datePicker, setDatePicker] = useState<"FROM" | "TO" | null>(null);
  const [partyPicker, setPartyPicker] = useState(false);

  return (
    <section className="statement-filters" dir="rtl">
      <div className="filter-card">
        <button
          className="party-field"
          type="button"
          onClick={() => setPartyPicker(true)}
        >
          <span className="party-icon">⌄</span>
          <span className={party ? "party-value" : "party-placeholder"}>
            {party ? party.name : "اختر العميل أو المورد"}
          </span>
          <span className="field-label">الاسم</span>
        </button>

        <button
          className="date-field"
          type="button"
          onClick={() => setDatePicker("FROM")}
        >
          <span className="calendar-icon">▦</span>
          <span className="date-value">{dateLabel(from)}</span>
          <span className="field-label">من</span>
        </button>

        <button
          className="date-field"
          type="button"
          onClick={() => setDatePicker("TO")}
        >
          <span className="calendar-icon">▦</span>
          <span className="date-value">{dateLabel(to)}</span>
          <span className="field-label">إلى</span>
        </button>

        <button
          className="continue-button"
          type="button"
          onClick={() => onContinue?.({ from, to, party })}
        >
          استمرار
        </button>
      </div>

      {datePicker === "FROM" && <DatePickerModal title="من" value={from} onClose={() => setDatePicker(null)} onChange={(d) => { setFrom(d); if (d > to) setTo(d); }} />}
      {datePicker === "TO" && <DatePickerModal title="إلى" value={to} onClose={() => setDatePicker(null)} onChange={(d) => { setTo(d < from ? from : d); }} />}
      
      {partyPicker && <PartyPickerModal title="اختر" customers={customers} suppliers={suppliers} value={party} onClose={() => setPartyPicker(false)} onChange={setParty} />}
    </section>
  );
}

export function DatePickerModal({
  value,
  title,
  onClose,
  onChange,
}: {
  value: Date;
  title: string;
  onClose: () => void;
  onChange: (d: Date) => void;
}) {
  const [activeDate, setActiveDate] = useState(value);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => current - 5 + i);
  }, []);

  const days = useMemo(() => {
    const maxDay = new Date(
      activeDate.getFullYear(),
      activeDate.getMonth() + 1,
      0
    ).getDate();
    return Array.from({ length: maxDay }, (_, i) => i + 1);
  }, [activeDate]);

  const setPickerValue = (part: "year" | "month" | "day", val: number) => {
    const next = new Date(activeDate);
    if (part === "year") next.setFullYear(val);
    if (part === "month") next.setMonth(val);
    if (part === "day") next.setDate(val);
    setActiveDate(next);
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose} style={{ zIndex: 9999 }}>
      <div className="picker-modal" onMouseDown={(e) => e.stopPropagation()} dir="rtl">
        <button className="close-button" type="button" onClick={onClose} aria-label="إغلاق">×</button>
        <h2>{title}</h2>
        <div className="wheel-picker">
          <Wheel values={years} value={activeDate.getFullYear()} onChange={(v) => setPickerValue("year", v)} />
          <Wheel values={months.map((_, i) => i)} labels={months} value={activeDate.getMonth()} onChange={(v) => setPickerValue("month", v)} />
          <Wheel values={days} value={activeDate.getDate()} onChange={(v) => setPickerValue("day", v)} />
        </div>
        <button className="confirm-button" type="button" onClick={() => { onChange(activeDate); onClose(); }}>حسنًا</button>
      </div>
    </div>
  );
}

export function PartyPickerModal({
  customers = [],
  suppliers = [],
  value,
  title,
  onClose,
  onChange,
}: {
  customers?: Party[];
  suppliers?: Party[];
  value: Party | null;
  title: string;
  onClose: () => void;
  onChange: (p: Party | null) => void;
}) {
  const [partyTab, setPartyTab] = useState<"CUSTOMER" | "SUPPLIER">(customers && customers.length ? "CUSTOMER" : "SUPPLIER");
  const [searchQuery, setSearchQuery] = useState("");
  const activeParties = partyTab === "CUSTOMER" ? customers : suppliers;
  const filteredParties = activeParties.filter(party => party.name.toLowerCase().includes(searchQuery.toLowerCase()) || (party.phone && party.phone.includes(searchQuery)));

  return (
    <div className="modal-backdrop" onMouseDown={onClose} style={{ zIndex: 9999 }}>
      <div className="party-modal" onMouseDown={(e) => e.stopPropagation()} dir="rtl">
        <button className="close-button" type="button" onClick={onClose}>×</button>
        <h2>{title || (customers.length && !suppliers.length ? "العملاء" : suppliers.length && !customers.length ? "الموردين" : partyTab === "CUSTOMER" ? "العملاء" : "الموردين")}</h2>
        
        {customers && customers.length > 0 && suppliers && suppliers.length > 0 && (
          <div className="party-tabs">
            <button type="button" className={partyTab === "CUSTOMER" ? "active" : ""} onClick={() => {setPartyTab("CUSTOMER"); setSearchQuery("");}}>العملاء</button>
            <button type="button" className={partyTab === "SUPPLIER" ? "active" : ""} onClick={() => {setPartyTab("SUPPLIER"); setSearchQuery("");}}>الموردين</button>
          </div>
        )}
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block pr-10 p-3 outline-none"
            placeholder="البحث بالاسم أو رقم الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir="rtl"
            autoFocus
          />
        </div>
        
        <div className="party-list">
          {filteredParties.map((item) => (
            <button
              type="button"
              className={`party-option ${value?.id === item.id ? "selected" : ""}`}
              key={item.id}
              onClick={() => {
                onChange(item);
                onClose();
              }}
            >
              <span className="party-avatar">{item.name.charAt(0)}</span>
              <span className="party-details">
                <strong>{item.name}</strong>
                {item.phone && <small>{item.phone}</small>}
              </span>
              <span className="party-check">{value?.id === item.id ? "✓" : ""}</span>
            </button>
          ))}
          {!filteredParties.length && <div className="empty-parties">لا توجد أسماء مسجلة تطابق البحث</div>}
        </div>
      </div>
    </div>
  );
}

export function CustomDatePicker({ value, onChange, label, className }: { value: string; onChange: (v: string) => void; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const dateObj = value ? new Date(value) : new Date();
  
  return (
    <>
      <button 
        type="button" 
        onClick={() => setOpen(true)}
        className={className || "input-field py-2 text-right w-full flex justify-between items-center bg-white"}
        dir="rtl"
      >
        <span>{value ? dateLabel(dateObj) : 'اختر التاريخ'}</span>
        <span className="text-teal-600 font-bold text-xl">▦</span>
      </button>
      {open && (
        <DatePickerModal 
          title={label || "اختر التاريخ"} 
          value={dateObj} 
          onChange={(d) => {
            const dString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            onChange(dString);
          }} 
          onClose={() => setOpen(false)} 
        />
      )}
    </>
  );
}

export function CustomPartyPicker({ value, onChange, customers = [], suppliers = [], label, className, type = 'customer' }: { value: string; onChange: (v: string) => void; customers?: Party[]; suppliers?: Party[]; label?: string; className?: string; type?: 'customer' | 'supplier' | 'both' }) {
  const [open, setOpen] = useState(false);
  const allParties = [...customers, ...suppliers];
  const partyObj = allParties.find(p => p.id === value) || null;
  
  return (
    <>
      <button 
        type="button" 
        onClick={() => setOpen(true)}
        className={className || "input-field py-2 text-right w-full flex justify-between items-center bg-white"}
        dir="rtl"
      >
        <span>{partyObj ? partyObj.name : 'اختر الاسم'}</span>
        <span className="text-teal-600 font-bold text-xl">⌄</span>
      </button>
      {open && (
        <PartyPickerModal 
          title={label || "اختر"} 
          customers={type === 'supplier' ? [] : customers}
          suppliers={type === 'customer' ? [] : suppliers}
          value={partyObj} 
          onChange={(p) => onChange(p ? p.id : '')} 
          onClose={() => setOpen(false)} 
        />
      )}
    </>
  );
}

function Wheel({
  values,
  labels,
  value,
  onChange,
}: {
  values: number[];
  labels?: string[];
  value: number;
  onChange: (value: number) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemHeight = 60;
  
  const isAutoScrolling = React.useRef(false);

  React.useEffect(() => {
    if (scrollRef.current) {
      const index = values.indexOf(value);
      if (index !== -1) {
        isAutoScrolling.current = true;
        scrollRef.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
        setTimeout(() => { isAutoScrolling.current = false; }, 300);
      }
    }
  }, [value, values]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isAutoScrolling.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < values.length && values[index] !== value) {
      onChange(values[index]);
    }
  };

  return (
    <div className="wheel-column" ref={scrollRef} onScroll={handleScroll}>
      <div style={{ height: itemHeight, minHeight: itemHeight, flexShrink: 0 }} />
      {values.map((item, i) => (
        <button
          type="button"
          key={`${item}-${i}`}
          className={`wheel-item ${value === item ? "current" : ""}`}
          onClick={() => onChange(item)}
        >
          {labels ? labels[item] : item}
        </button>
      ))}
      <div style={{ height: itemHeight, minHeight: itemHeight, flexShrink: 0 }} />
    </div>
  );
}
