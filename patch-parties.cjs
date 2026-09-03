const fs = require('fs');
let code = fs.readFileSync('src/pages/Parties.tsx', 'utf8');

// Ensure BookUser or Contact icon is imported from lucide-react
if (!code.includes('Contact,')) {
  code = code.replace(/import { Plus, Search, /, "import { Plus, Search, Contact, ");
}

const pickContactFn = `
  const pickContact = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        // @ts-ignore
        const contacts = await navigator.contacts.select(props, opts);
        if (contacts && contacts.length > 0) {
          const contact = contacts[0];
          if (contact.tel && contact.tel.length > 0) {
            setPhone(contact.tel[0].replace(/\\s+/g, ''));
          }
          if (contact.name && contact.name.length > 0 && !name) {
            setName(contact.name[0]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('متصفحك لا يدعم خاصية اختيار جهات الاتصال (متاحة فقط في متصفح Chrome على الهاتف).');
    }
  };
`;

// Insert function before openModal
if (!code.includes('pickContact = async')) {
  code = code.replace("const openModal = (", pickContactFn + "\n  const openModal = (");
}

const originalPhoneInputBlock = `<div>
                  <label className="label">رقم الهاتف</label>
                  <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="05XXXXXXXX" dir="ltr" />
                </div>`;

const newPhoneInputBlock = `<div>
                  <label className="label">رقم الهاتف</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={pickContact}
                      className="shrink-0 w-12 h-12 bg-slate-100 hover:bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center border border-slate-200 transition-colors"
                      title="اختيار من جهات الاتصال"
                    >
                      <Contact className="w-5 h-5" />
                    </button>
                    <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-field flex-1" placeholder="05XXXXXXXX" dir="ltr" />
                  </div>
                </div>`;

code = code.replace(originalPhoneInputBlock, newPhoneInputBlock);

fs.writeFileSync('src/pages/Parties.tsx', code);
console.log('Parties patched with contact picker');
