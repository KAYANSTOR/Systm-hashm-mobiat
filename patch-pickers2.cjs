const fs = require('fs');
let code = fs.readFileSync('src/components/StatementFilters.tsx', 'utf8');

code = code.replace(/export function CustomPartyPicker\(\{[\s\S]*?\}\) \{[\s\S]*?\}\)/, `export function CustomPartyPicker({ value, onChange, customers = [], suppliers = [], label, className, type = 'customer' }: { value: string; onChange: (v: string) => void; customers?: Party[]; suppliers?: Party[]; label?: string; className?: string; type?: 'customer' | 'supplier' | 'both' }) {
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
}`);

code = code.replace(/\{suppliers && suppliers\.length > 0 && \(/, `{customers && customers.length > 0 && suppliers && suppliers.length > 0 && (`);

// Ensure the title defaults correctly if only one is passed
code = code.replace(/<h2>\{title \|\| \(partyTab === "CUSTOMER" \? "العملاء" : "الموردين"\)\}<\/h2>/, `<h2>{title || (customers.length && !suppliers.length ? "العملاء" : suppliers.length && !customers.length ? "الموردين" : partyTab === "CUSTOMER" ? "العملاء" : "الموردين")}</h2>`);

// Set default partyTab based on what's available
code = code.replace(/const \[partyTab, setPartyTab\] = useState<"CUSTOMER" \| "SUPPLIER">\("CUSTOMER"\);/, `const [partyTab, setPartyTab] = useState<"CUSTOMER" | "SUPPLIER">(customers && customers.length ? "CUSTOMER" : "SUPPLIER");`);


fs.writeFileSync('src/components/StatementFilters.tsx', code);
