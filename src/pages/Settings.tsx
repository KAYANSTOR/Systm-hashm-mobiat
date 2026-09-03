import React, { useState } from 'react';
import { Save, UploadCloud, DownloadCloud, Shield, Database, Smartphone, User as UserIcon, Bell } from 'lucide-react';
import { auth } from '../firebase';

export default function Settings() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toISOString());

  const handleBackup = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toISOString());
      alert('تم إنشاء نسخة احتياطية بنجاح!');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">الإعدادات</h2>
          <p className="text-sm text-slate-500 mt-1">إدارة حسابك وتفضيلات النظام</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{auth.currentUser?.displayName || 'المستخدم'}</h3>
          <p className="text-slate-500 text-sm" dir="ltr">{auth.currentUser?.email || 'user@example.com'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 px-2 text-lg">النسخ الاحتياطي والمزامنة</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">نسخ احتياطي للبيانات</h4>
                <p className="text-xs text-slate-500 mt-0.5">آخر نسخة: {new Date(lastSync).toLocaleString('ar-YE')}</p>
              </div>
            </div>
            <button 
              onClick={handleBackup}
              disabled={isSyncing}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
            >
              {isSyncing ? 'جاري النسخ...' : 'نسخ الآن'}
            </button>
          </div>
          
          <div className="p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">استعادة البيانات</h4>
                <p className="text-xs text-slate-500 mt-0.5">استرجاع البيانات من نسخة سابقة</p>
              </div>
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
              استعادة
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 px-2 text-lg">عام</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <button className="w-full p-5 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="font-bold text-slate-800">الإشعارات</h4>
                <p className="text-xs text-slate-500 mt-0.5">تخصيص التنبيهات والأصوات</p>
              </div>
            </div>
          </button>
          
          <button className="w-full p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="font-bold text-slate-800">الأمان والخصوصية</h4>
                <p className="text-xs text-slate-500 mt-0.5">تغيير كلمة المرور وتأمين الحساب</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <div className="text-center text-slate-400 text-xs mt-8 mb-4">
        <p>الإصدار 1.0.0</p>
        <p className="mt-1">جميع الحقوق محفوظة &copy; 2026</p>
      </div>
    </div>
  );
}
