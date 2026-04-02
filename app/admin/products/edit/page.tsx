'use client';

import { useState, useEffect } from 'react';
import { getProductById, getCategories, updateProduct, getProductKeys, addKeysToProduct, deleteKey } from '@/lib/admin-actions';
import { Package, ArrowRight, Loader2, Save, Key, PlusCircle, Trash2, ShieldCheck, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function AdminEditProductPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [keys, setKeys] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState('');
  
  // Keys Manager State
  const [newKeys, setNewKeys] = useState('');
  const [keysLoading, setKeysLoading] = useState(false);
  const [keysMessage, setKeysMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const sp = await searchParams;
        if (!sp.id) {
          setLoadingInitial(false);
          return;
        }

        const [prodData, catsData, keysData] = await Promise.all([
          getProductById(sp.id),
          getCategories(),
          getProductKeys(sp.id)
        ]);

        setProduct(prodData);
        setCategories(catsData);
        setKeys(keysData);
        if (prodData) setImage(prodData.image || '');
      } catch (err) {
        console.error(err);
      }
      setLoadingInitial(false);
    }
    loadData();
  }, [searchParams]);

  async function handleProductSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');
    
    if (!formData.get('slug')) {
       formData.set('slug', (formData.get('nameAr') as string).replace(/\s+/g, '-').toLowerCase() + '-' + Date.now());
    }

    if (image) {
      formData.set('image', image);
    }

    const res = await updateProduct(product.id, formData);
    if (res.error) {
      setError(res.error);
      setSubmitting(false);
    } else {
      router.push(`/admin/products`);
      router.refresh();
    }
  }

  const handleAddKeys = async () => {
    setKeysMessage(null);
    if (!newKeys.trim()) {
      setKeysMessage({ type: 'error', text: 'يرجى إدخال مفتاح واحد على الأقل' });
      return;
    }

    setKeysLoading(true);
    try {
      const res = await addKeysToProduct(product.id, newKeys);
      if (res.error) {
        setKeysMessage({ type: 'error', text: res.error });
      } else {
        setKeysMessage({ type: 'success', text: `تم إضافة ${res.count} مفاتيح بالنجاح!` });
        setNewKeys('');
        
        // Refresh keys
        const freshKeys = await getProductKeys(product.id);
        setKeys(freshKeys);
      }
    } catch (err) {
      setKeysMessage({ type: 'error', text: 'فشل في الاتصال' });
    }
    setKeysLoading(false);
  };

  const handleRemoveKey = async (id: string, code: string) => {
    if (!confirm(`هل أنت متأكد من حذف المفتاح "${code}"؟ لا يمكن التراجع.`)) return;
    try {
      await deleteKey(id);
      const freshKeys = await getProductKeys(product.id);
      setKeys(freshKeys);
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  if (loadingInitial) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}><Loader2 className="animate-spin" size={48} color="#e879f9" /></div>;
  }

  if (!product) {
    return <div style={{ padding: '6rem', textAlign: 'center', color: 'white', fontSize: '1.25rem' }}>المنتج غير موجود أو محذوف</div>;
  }

  const availableKeys = keys.filter(k => k.status === 'AVAILABLE');
  const soldKeys = keys.filter(k => k.status === 'SOLD');

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Back Button */}
      <div>
        <Link 
          href="/admin/products" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '1rem' }}
        >
          <ArrowRight size={18} /> العودة إلى المنتجات
        </Link>
      </div>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Form Section */}
        <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
          <h1 className="title-font" style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Package style={{ color: '#60a5fa' }} size={32} /> تعديل بيانات المنتج
          </h1>

          {error && (
            <div style={{ backgroundColor: 'rgba(244,63,94,0.1)', color: '#fb7185', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid rgba(244,63,94,0.2)', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          <form action={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>الاسم (بالعربية)</label>
                <input name="nameAr" defaultValue={product.nameAr} required style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = '#60a5fa'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>الاسم (بالفرنسية)</label>
                <input name="nameFr" defaultValue={product.nameFr} style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = '#60a5fa'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'} />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>التصنيف</label>
                <select name="categoryId" defaultValue={product.categoryId} required style={{ width: '100%', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none' }}>
                  <option value="">-- اختر التصنيف --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>السعر (د.ج)</label>
                <input name="price" type="number" step="0.01" defaultValue={Number(product.price)} required style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', color: '#60a5fa', fontWeight: 'bold', outline: 'none', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = '#60a5fa'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'} dir="ltr" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>صورة المنتج المتوفرة حالياً</label>
              <ImageUpload value={image} onChange={setImage} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>الوصف التفصيلي (عربي)</label>
              <textarea name="descriptionAr" defaultValue={product.descriptionAr} rows={4} required style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none', resize: 'vertical' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>الوصف التفصيلي (فرنسي)</label>
              <textarea name="descriptionFr" defaultValue={product.descriptionFr} rows={4} style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none', resize: 'vertical' }} />
            </div>
            
            <input type="hidden" name="slug" value={product.slug} />

            <button 
              type="submit" 
              disabled={submitting}
              style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', fontWeight: 900, fontSize: '1.125rem', color: 'white', backgroundColor: '#3b82f6', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}
            >
              {submitting ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> حفظ بيانات المنتج</>}
            </button>
          </form>
        </div>

        {/* Keys Management Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Status Boxes */}
          <div className="flex-col-mobile" style={{ display: 'flex', gap: '1rem' }}>
             <div className="glass-morphism" style={{ flex: 1, padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(52, 211, 153, 0.2)', backgroundColor: 'rgba(52, 211, 153, 0.05)' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(52, 211, 153, 0.1)' }}>
                  <ShieldCheck size={24} color="#34d399" />
                </div>
                <div>
                  <div style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>أكواد متاحة</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{availableKeys.length}</div>
                </div>
              </div>

              <div className="glass-morphism" style={{ flex: 1, padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <ShoppingCart size={24} color="#ef4444" />
                </div>
                <div>
                  <div style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>مباعة بالكامل</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{soldKeys.length}</div>
                </div>
              </div>
          </div>

          <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
            <h3 className="title-font" style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={24} color="#f59e0b" /> ملقم السيريالات والمفاتيح
            </h3>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              النسخ واللصق مدعوم هنا! ضع كل كود في سطر مستقل. النظام سيقوم بسحب أول مفتاح عشوائي متوفر وتسليمه تلقائياً فور توفر طلب شراء مكتمل.
            </p>

            <textarea 
              value={newKeys}
              onChange={(e) => setNewKeys(e.target.value)}
              placeholder="1A2B-3C4D-5E6F-7890&#10;QW12-ER34-TY56-UI78&#10;..."
              style={{ width: '100%', minHeight: '180px', padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.2)', color: 'white', fontFamily: 'monospace', fontSize: '1rem', outline: 'none', resize: 'vertical', marginBottom: '1.5rem', direction: 'ltr', letterSpacing: '1px' }}
              onFocus={e => e.target.style.borderColor = '#f59e0b'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            />

            {keysMessage && (
              <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: keysMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(52, 211, 153, 0.1)', color: keysMessage.type === 'error' ? '#fb7185' : '#34d399', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                {keysMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                {keysMessage.text}
              </div>
            )}

            <button 
               onClick={handleAddKeys}
               disabled={keysLoading || !newKeys}
               style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1.1rem', color: 'black', backgroundColor: '#f59e0b', border: 'none', cursor: (keysLoading || !newKeys) ? 'not-allowed' : 'pointer', opacity: (keysLoading || !newKeys) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)' }}
             >
               {keysLoading ? <Loader2 className="animate-spin" size={20} /> : <><PlusCircle size={20} /> شحن المخزون بالسيريالات</>}
            </button>
          </div>

          <div className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontWeight: 800, paddingRight: '0.5rem' }}>المفاتيح المتاحة ({availableKeys.length})</h4>
            {availableKeys.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--foreground-muted)' }}>لا توجد سيريالات متاحة!</div>
            ) : (
               <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {availableKeys.map(k => (
                     <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontFamily: 'monospace', letterSpacing: '1px', color: '#f59e0b', fontSize: '0.9rem' }}>{k.code}</span>
                        <button onClick={() => handleRemoveKey(k.id, k.code)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }} title="حذف المفتاح">
                          <Trash2 size={16} />
                        </button>
                     </div>
                  ))}
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
