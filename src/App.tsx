import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import Layout, { TabType } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Vouchers from './pages/Vouchers';
import Parties from './pages/Parties';
import Reports from './pages/Reports';
import { auth, signInWithGoogle, signOut } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]"><p className="text-lg text-slate-500 font-bold">جاري التحميل...</p></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] p-4 font-tajawal" dir="rtl">
        <div className="bg-white p-8 rounded-[24px] shadow-xl max-w-sm w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-black border border-teal-100 shadow-inner">
            هـ
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">معمل هاشم الأحمدي</h1>
          <p className="text-slate-500 mb-8 text-sm font-semibold">نظام إدارة التطريز الإلكتروني</p>
          
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-[#bc5f8f] hover:bg-[#a64e7a] text-white font-bold py-4 px-4 rounded-[16px] transition-colors shadow-lg shadow-[#bc5f8f]/30"
          >
            تسجيل الدخول بحساب جوجل
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'vouchers': return <Vouchers />;
      case 'parties': return <Parties />;
      case 'reports': return <Reports />;
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
