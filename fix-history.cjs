const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Add tabHistory state and effect
layout = layout.replace(/  const \[isNotificationsOpen, setIsNotificationsOpen\] = useState\(false\);\n/, `  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [tabHistory, setTabHistory] = useState<TabType[]>(['dashboard']);

  useEffect(() => {
    setTabHistory(prev => {
      if (prev[prev.length - 1] !== activeTab) {
        return [...prev, activeTab];
      }
      return prev;
    });
  }, [activeTab]);

  const handleBack = () => {
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
  };
`);

// Replace the back button
layout = layout.replace(/onClick=\{\(\) => setActiveTab\('dashboard'\)\}/, 'onClick={handleBack}');
layout = layout.replace(/title="رجوع للرئيسية"/, 'title="رجوع"');

fs.writeFileSync('src/components/Layout.tsx', layout, 'utf8');
