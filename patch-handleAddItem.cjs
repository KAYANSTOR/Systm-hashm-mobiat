const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

const targetFunction = `  const handleAddItem = () => {
    if (!selectedItemId) return;
    const invItem = inventory.find(i => i.id === selectedItemId);
    if (!invItem) return;

    const qty = parseFloat(itemQuantity) || 1;
    const price = parseFloat(itemPrice) || (invoiceType === 'sale' ? invItem.sellingPrice : invItem.costPrice);
    
    setItems(prev => [...prev, {
      id: Math.random().toString(),
      inventoryItemId: invItem.id,
      name: invItem.name,
      quantity: qty,
      unitPrice: price,
      total: qty * price
    }]);

    setSelectedItemId('');
    setItemQuantity('1');
    setItemPrice('');
  };`;

const replaceFunction = `  const handleAddItem = () => {
    const qty = parseFloat(itemQuantity) || 1;
    const price = parseFloat(itemPrice) || 0;

    if (invoiceType === 'sale' && salesType === 'SERVICE') {
      if (!serviceName) return;
      setItems(prev => [...prev, {
        id: Math.random().toString(),
        inventoryItemId: 'SERVICE',
        name: serviceName,
        description: serviceDesc,
        unit: serviceUnit,
        quantity: qty,
        unitPrice: price,
        total: qty * price
      }]);
      setServiceName('');
      setServiceDesc('');
      setItemQuantity('1');
      setItemPrice('');
    } else {
      if (!selectedItemId) return;
      const invItem = inventory.find(i => i.id === selectedItemId);
      if (!invItem) return;

      const finalPrice = price || (invoiceType === 'sale' ? invItem.sellingPrice : invItem.costPrice);
      
      setItems(prev => [...prev, {
        id: Math.random().toString(),
        inventoryItemId: invItem.id,
        name: invItem.name,
        quantity: qty,
        unitPrice: finalPrice,
        total: qty * finalPrice
      }]);

      setSelectedItemId('');
      setItemQuantity('1');
      setItemPrice('');
    }
  };`;

code = code.replace(targetFunction, replaceFunction);
fs.writeFileSync('src/pages/Sales.tsx', code);
