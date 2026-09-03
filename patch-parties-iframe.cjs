const fs = require('fs');
let code = fs.readFileSync('src/pages/Parties.tsx', 'utf8');

const oldPickContactFn = `
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

const newPickContactFn = `
  const pickContact = async () => {
    if (window.self !== window.top) {
      alert('لاستخدام ميزة اختيار جهات الاتصال، يرجى فتح التطبيق في علامة تبويب جديدة (عبر زر "Open App" أو "فتح في نافذة جديدة").');
      return;
    }

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
        alert('تعذر الوصول إلى جهات الاتصال. الرجاء التأكد من منح الصلاحيات اللازمة للتطبيق.');
      }
    } else {
      alert('متصفحك لا يدعم خاصية اختيار جهات الاتصال (متاحة فقط في متصفح Chrome أو متصفحات الاندرويد الداعمة).');
    }
  };
`;

code = code.replace(oldPickContactFn, newPickContactFn);

fs.writeFileSync('src/pages/Parties.tsx', code);
console.log('Parties patched to handle iframe restriction');
