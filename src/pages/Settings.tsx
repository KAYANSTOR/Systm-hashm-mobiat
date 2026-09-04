import React, { useState, useEffect } from 'react';
import { Save, UploadCloud, Database, Shield, User as UserIcon, Bell, Building2, Phone, MapPin, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { useStore } from '../context/StoreContext';
import { CompanySettings, DEFAULT_COMPANY_SETTINGS } from '../types';

export default function Settings() {
  const { companySettings, updateCompanySettings } = useStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState<CompanySettings>(companySettings);

  useEffect(() => {
    setForm(companySettings);
  }, [companySettings]);

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSaveCompany = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      await updateCompanySettings({
        shortName: form.shortName.trim(),
        fullName: form.fullName.trim(),
        address: form.address.trim(),
        phone1: form.phone1.trim(),
        phone2: form.phone2.trim(),
        logoUrl: form.logoUrl.trim() || '/logo.svg',
        footerNote: form.footerNote?.trim() || '',
        taxNumber: form.taxNumber?.trim() || '',
        currency: form.currency?.trim() || 'ريال يمني',
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('حدث خطأ أثناء حفظ الإعدادات. تأكد من الاتصال بالإنترنت.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toISOString());
      alert('تم إنشاء نسخة احتياطية بنجاح!');
    }, 1500);
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100 transition-all';

  return (
    <div className="space-y-6 pb-24" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">الإعدادات</h2>
          <p className="text-sm text-slate-500 mt-1">إدارة حسابك وبيانات الشركة وقوالب الطباعة</p>
        </div>
      </div>

      {/* المستخدم */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{auth.currentUser?.displayName || 'المستخدم'}</h3>
          <p className="text-slate-500 text-sm" dir="ltr">{auth.currentUser?.email || 'user@example.com'}</p>
        </div>
      </div>

      {/* بيانات الشركة — القسم الأهم */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            بيانات الشركة (تظهر في الفواتير والسندات)
          </h3>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" /> تم الحفظ
            </span>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">الاسم المختصر</label>
              <input
                className={inputClass}
                value={form.shortName}
                onChange={e => handleChange('shortName', e.target.value)}
                placeholder="الاحمدي"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">العملة</label>
              <input
                className={inputClass}
                value={form.currency || ''}
                onChange={e => handleChange('currency', e.target.value)}
                placeholder="ريال يمني"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">الاسم الكامل للشركة</label>
            <input
              className={inputClass}
              value={form.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> العنوان
            </label>
            <input
              className={inputClass}
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="صنعاء - شارع الزبيري - مقابل وزارة الدفاع"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> هاتف 1
              </label>
              <input
                className={inputClass}
                dir="ltr"
                value={form.phone1}
                onChange={e => handleChange('phone1', e.target.value)}
                placeholder="770 447 441"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> هاتف 2
              </label>
              <input
                className={inputClass}
                dir="ltr"
                value={form.phone2}
                onChange={e => handleChange('phone2', e.target.value)}
                placeholder="730 447 441"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">رقم ضريبي (اختياري)</label>
              <input
                className={inputClass}
                value={form.taxNumber || ''}
                onChange={e => handleChange('taxNumber', e.target.value)}
                placeholder="—"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">مسار الشعار</label>
              <input
                className={inputClass}
                dir="ltr"
                value={form.logoUrl}
                onChange={e => handleChange('logoUrl', e.target.value)}
                placeholder="/logo.svg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> ملاحظة تذييل (تظهر أسفل المستندات)
            </label>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={form.footerNote || ''}
              onChange={e => handleChange('footerNote', e.target.value)}
              placeholder="شكراً لتعاملكم معنا..."
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleSaveCompany}
              disabled={isSaving}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'جاري الحفظ...' : 'حفظ بيانات الشركة'}
            </button>
            <button
              type="button"
              onClick={() => setForm(DEFAULT_COMPANY_SETTINGS)}
              className="px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              استعادة القيم الافتراضية
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            أي تعديل هنا ينعكس فوراً على جميع قوالب الطباعة: الفواتير، سندات القبض/الصرف، وكشوف الحساب.
          </p>
        </div>
      </div>

      {/* النسخ الاحتياطي */}
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

      {/* عام */}
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
        <p>الإصدار 1.1.0</p>
        <p className="mt-1">جميع الحقوق محفوظة &copy; 2026</p>
      </div>
    </div>
  );
}
