import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import Layout, { TabType } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Vouchers from './pages/Vouchers';
import Parties from './pages/Parties';
import Reports from './pages/Reports';
import CashBox from './pages/CashBox';
import Expenses from './pages/Expenses';
import { auth, signInWithGoogle, signOut } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);



  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'vouchers': return <Vouchers />;
      case 'parties': return <Parties />;
      case 'reports': return <Reports />;
      case 'cashbox': return <CashBox />;
      case 'expenses': return <Expenses />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <StoreProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={signOut} user={user}>
        {renderContent()}
      </Layout>
    </StoreProvider>
  );
}
