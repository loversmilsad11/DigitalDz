'use client';

import { useState } from 'react';
import { updateProduct } from '@/lib/admin-actions';
import { Package, ArrowRight, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function EditProductClient({ product, categories }: { product: any, categories: any[] }) {
  const router = useRouter();
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(product.image || '');

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');
    
    // Auto-generate slug if empty
    if (!formData.get('slug')) {
       formData.set('slug', (formData.get('nameAr') as string).replace(/\s+/g, '-').toLowerCase() + '-' + Date.now());
    }

    // Set the image base64 if it exists
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link 
        href="/admin/products" 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground-muted)', marginBottom: '1.5rem', textDecoration: 'none' }}
      >
        <ArrowRight size={20} /> العودة للمنتجات
      </Link>

      <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
        <h1 className="title-font" style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package style={{ color: '#60a5fa' }} /> تعديل المنتج: {product.nameAr}
        </h1>

        {error && (
          <div style={{ backgroundColor: 'rgba(244,63,94,0.2)', color: '#fda4af', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(244,63,94,0.3)', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>اسم المنتج (بالعربية)</label>
              <input name="nameAr" defaultValue={product.nameAr} required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>اسم المنتج (بالفرنسية)</label>
              <input name="nameFr" defaultValue={product.nameFr} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>الفئة</label>
              {categories.length === 0 ? (
                <div style={{ color: '#fb7185', fontSize: '0.875rem' }}>يجب إضافة تصنيفات أولاً.</div>
              ) : (
                <select name="categoryId" defaultValue={product.categoryId} required style={{ width: '100%', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none' }}>
                  <option value="">-- اختر الفئة --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>السعر (د.ج)</label>
              <input name="price" type="number" step="0.01" defaultValue={Number(product.price)} required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none' }} dir="ltr" />
            </div>
          </div>

          <ImageUpload value={image} onChange={setImage} />

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>الوصف (بالعربية)</label>
            <textarea name="descriptionAr" defaultValue={product.descriptionAr} rows={4} required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', resize: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>الوصف (بالفرنسية)</label>
            <textarea name="descriptionFr" defaultValue={product.descriptionFr} rows={4} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', color: 'white', outline: 'none', resize: 'none' }} />
          </div>
          
          <input type="hidden" name="slug" value={product.slug} />

          <button 
            type="submit" 
            disabled={submitting || categories.length === 0}
            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1.125rem', color: 'white', backgroundColor: '#3b82f6', border: 'none', cursor: submitting || categories.length === 0 ? 'not-allowed' : 'pointer', opacity: submitting || categories.length === 0 ? 0.5 : 1 }}
          >
            {submitting ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> حفظ التعديلات</>}
          </button>
        </form>
      </div>
    </div>
  );
}
