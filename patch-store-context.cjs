const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// Patch addInvoice
const addInvoiceMatch = /i\.items\.forEach\(item => \{\s*const invRef = doc\(db, 'inventory', item\.inventoryItemId\);\s*const qtyChange = i\.type === 'sale' \? -item\.quantity : item\.quantity;\s*batch\.update\(invRef, \{ quantity: increment\(qtyChange\) \}\);\s*\}\);/;

const newAddInvoice = `if (i.invoiceType !== 'SERVICE') {
          i.items.forEach(item => {
            if (item.inventoryItemId) {
              const invRef = doc(db, 'inventory', item.inventoryItemId);
              const qtyChange = i.type === 'sale' ? -item.quantity : item.quantity;
              batch.update(invRef, { quantity: increment(qtyChange) });
            }
          });
        }`;
content = content.replace(addInvoiceMatch, newAddInvoice);


// Patch updateInvoice - part 1
const updateInvoiceMatch1 = /oldInvoice\.items\.forEach\(item => \{\s*const invRef = doc\(db, 'inventory', item\.inventoryItemId\);\s*const qtyChange = oldInvoice\.type === 'sale' \? item\.quantity : -item\.quantity;\s*batch\.update\(invRef, \{ quantity: increment\(qtyChange\) \}\);\s*\}\);/;

const newUpdateInvoice1 = `if (oldInvoice.invoiceType !== 'SERVICE') {
          oldInvoice.items.forEach(item => {
            if (item.inventoryItemId) {
              const invRef = doc(db, 'inventory', item.inventoryItemId);
              const qtyChange = oldInvoice.type === 'sale' ? item.quantity : -item.quantity;
              batch.update(invRef, { quantity: increment(qtyChange) });
            }
          });
        }`;
content = content.replace(updateInvoiceMatch1, newUpdateInvoice1);

// Patch updateInvoice - part 2
const updateInvoiceMatch2 = /newInvoice\.items\.forEach\(item => \{\s*const invRef = doc\(db, 'inventory', item\.inventoryItemId\);\s*const qtyChange = newInvoice\.type === 'sale' \? -item\.quantity : item\.quantity;\s*batch\.update\(invRef, \{ quantity: increment\(qtyChange\) \}\);\s*\}\);/;

const newUpdateInvoice2 = `if (newInvoice.invoiceType !== 'SERVICE') {
          newInvoice.items.forEach(item => {
            if (item.inventoryItemId) {
              const invRef = doc(db, 'inventory', item.inventoryItemId);
              const qtyChange = newInvoice.type === 'sale' ? -item.quantity : item.quantity;
              batch.update(invRef, { quantity: increment(qtyChange) });
            }
          });
        }`;
content = content.replace(updateInvoiceMatch2, newUpdateInvoice2);

// Patch deleteInvoice
const deleteInvoiceMatch = /invoice\.items\.forEach\(item => \{\s*const invRef = doc\(db, 'inventory', item\.inventoryItemId\);\s*const qtyChange = invoice\.type === 'sale' \? item\.quantity : -item\.quantity;\s*batch\.update\(invRef, \{ quantity: increment\(qtyChange\) \}\);\s*\}\);/;

const newDeleteInvoice = `if (invoice.invoiceType !== 'SERVICE') {
          invoice.items.forEach(item => {
            if (item.inventoryItemId) {
              const invRef = doc(db, 'inventory', item.inventoryItemId);
              const qtyChange = invoice.type === 'sale' ? item.quantity : -item.quantity;
              batch.update(invRef, { quantity: increment(qtyChange) });
            }
          });
        }`;
content = content.replace(deleteInvoiceMatch, newDeleteInvoice);

// Patch approveInvoice
const approveInvoiceMatch = /invoice\.items\.forEach\(item => \{\s*const invRef = doc\(db, 'inventory', item\.inventoryItemId\);\s*const qtyChange = invoice\.type === 'sale' \? -item\.quantity : item\.quantity;\s*batch\.update\(invRef, \{ quantity: increment\(qtyChange\) \}\);\s*\}\);/;

const newApproveInvoice = `if (invoice.invoiceType !== 'SERVICE') {
          invoice.items.forEach(item => {
            if (item.inventoryItemId) {
              const invRef = doc(db, 'inventory', item.inventoryItemId);
              const qtyChange = invoice.type === 'sale' ? -item.quantity : item.quantity;
              batch.update(invRef, { quantity: increment(qtyChange) });
            }
          });
        }`;
content = content.replace(approveInvoiceMatch, newApproveInvoice);

fs.writeFileSync('src/context/StoreContext.tsx', content, 'utf8');
console.log("StoreContext updated successfully.");
