const fs = require('fs');
let code = fs.readFileSync('src/components/StatementFilters.tsx', 'utf8');

if (!code.includes('import { Search }')) {
  code = code.replace(/import React, \{ useState, useMemo \} from 'react';/, "import React, { useState, useMemo } from 'react';\nimport { Search } from 'lucide-react';");
}

const oldPartyPickerModal = `export function PartyPickerModal({
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
  const activeParties = partyTab === "CUSTOMER" ? customers : suppliers;`;

const newPartyPickerModal = `export function PartyPickerModal({
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
  const filteredParties = activeParties.filter(party => party.name.toLowerCase().includes(searchQuery.toLowerCase()) || (party.phone && party.phone.includes(searchQuery)));`;

code = code.replace(oldPartyPickerModal, newPartyPickerModal);

const oldPartyTabs = `        {customers && customers.length > 0 && suppliers && suppliers.length > 0 && (
          <div className="party-tabs">
            <button type="button" className={partyTab === "CUSTOMER" ? "active" : ""} onClick={() => setPartyTab("CUSTOMER")}>العملاء</button>
            <button type="button" className={partyTab === "SUPPLIER" ? "active" : ""} onClick={() => setPartyTab("SUPPLIER")}>الموردين</button>
          </div>
        )}`;

const newPartyTabs = `        {customers && customers.length > 0 && suppliers && suppliers.length > 0 && (
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
        </div>`;

code = code.replace(oldPartyTabs, newPartyTabs);

const oldPartyList = `        <div className="party-list">
          {activeParties.map((item) => (
            <button`;

const newPartyList = `        <div className="party-list">
          {filteredParties.map((item) => (
            <button`;

code = code.replace(oldPartyList, newPartyList);

const oldEmptyParties = `          {!activeParties.length && <div className="empty-parties">لا توجد أسماء مسجلة</div>}`;
const newEmptyParties = `          {!filteredParties.length && <div className="empty-parties">لا توجد أسماء مسجلة تطابق البحث</div>}`;
code = code.replace(oldEmptyParties, newEmptyParties);

fs.writeFileSync('src/components/StatementFilters.tsx', code);
console.log('patched StatementFilters.tsx with autocomplete');
