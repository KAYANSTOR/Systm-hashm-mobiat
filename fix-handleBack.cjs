const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const oldHandleBack = `  const handleBack = () => {
    setTabHistory(prev => {
      if (prev.length > 1) {
        const newHistory = [...prev];
        newHistory.pop();
        setActiveTab(newHistory[newHistory.length - 1]);
        return newHistory;
      }
      setActiveTab('dashboard');
      return prev;
    });
  };`;

const newHandleBack = `  const handleBack = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop();
      const prevTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(prevTab);
    } else {
      setActiveTab('dashboard');
    }
  };`;

layout = layout.replace(oldHandleBack, newHandleBack);
fs.writeFileSync('src/components/Layout.tsx', layout, 'utf8');
