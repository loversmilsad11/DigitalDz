'use client';
import { use, useState, useEffect } from 'react';
import { getCategories, createProduct } from '@/lib/admin-actions';
import { Package, ArrowRight, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProductAdminPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCats() {
      try {
        setCategories(await getCategories());
      } catch (e) {
        console.error(e);
      }
      setLoadingCats(false);
    }
    loadCats();
  }, []);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');
    
    // Auto-generate slug if empty (for simplicity)
    if (!formData.get('slug')) {
       formData.set('slug', (formData.get('nameAr') as string).replace(/\s+/g, '-').toLowerCase() + '-' + Date.now());
    }

    const res = await createProduct(formData);
    if (res.error) {
      setError(res.error);
      setSubmitting(false);
    } else {
      router.push(`/${params.locale}/admin/products`);
      router.refresh();
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link 
        href={`/${params.locale}/admin/products`} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground-muted)', marginBottom: '1.5rem', textDecoration: 'none', transition: 'color 0.2s' }}
        onMouseOver={e => e.currentTarget.style.color = 'white'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--foreground-muted)'}
      >
        <ArrowRight size={20} /> العودة للمنتجات
      </Link>

      <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
        <h1 className="title-font" style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package style={{ color: '#e879f9' }} /> إضافة منتج جديد
        </h1>

        {error && (
          <div style={{ backgroundColor: 'rgba(244,63,94,0.2)', color: '#fda4af', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(244,63,94,0.3)', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        {loadingCats ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 className="animate-spin" style={{ color: '#e879f9' }} size={40} />
          </div>
        ) : (
          <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>اسم المنتج (بالعربية)</label>
                <input name="nameAr" required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#e879f9'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="مثال: بطاقة هدايا بلايستيشن" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>اسم المنتج (بالفرنسية)</label>
                <input name="nameFr" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#e879f9'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="Ex: Carte PSN" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>التصنيف</label>
              {categories.length === 0 ? (
                <div style={{ color: '#fb7185', fontSize: '0.875rem' }}>يجب إضافة تصنيفات أولاً من قسم الإدارة قبل إضافة منتجات.</div>
              ) : (
                <select name="categoryId" required style={{ width: '100%', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#e879f9'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                  <option value="">-- اختر التصنيف --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>السعر (بالدينار الجزائري)</label>
                <input name="price" type="number" step="0.01" required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#e879f9'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="مثال: 1500" dir="ltr" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>رابط صورة المنتج (URL)</label>
                <input name="image" type="url" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#e879f9'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="https://example.com/image.jpg" dir="ltr" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>وصف المنتج (بالعربية)</label>
              <textarea name="descriptionAr" rows={4} required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s', resize: 'none' }} onFocus={e => e.target.style.borderColor = '#e879f9'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="وصف المنتج..." />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>وصف المنتج (بالفرنسية)</label>
              <textarea name="descriptionFr" rows={4} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s', resize: 'none' }} onFocus={e => e.target.style.borderColor = '#e879f9'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="Description du produit..." />
            </div>
            
            <input type="hidden" name="slug" value="" />

            <button 
              type="submit" 
              disabled={submitting || categories.length === 0}
              style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1.125rem', color: 'white', backgroundColor: '#c026d3', transition: 'background-color 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', boxShadow: '0 4px 15px rgba(192, 38, 211, 0.3)', border: 'none', cursor: submitting || categories.length === 0 ? 'not-allowed' : 'pointer', opacity: submitting || categories.length === 0 ? 0.5 : 1 }}
              onMouseOver={e => !submitting && categories.length > 0 && (e.currentTarget.style.backgroundColor = '#a21caf')}
              onMouseOut={e => !submitting && categories.length > 0 && (e.currentTarget.style.backgroundColor = '#c026d3')}
            >
              {submitting ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> حفظ المنتج</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
