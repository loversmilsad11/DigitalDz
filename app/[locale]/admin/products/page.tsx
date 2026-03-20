'use client';
import { use, useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '@/lib/admin-actions';
import { Package, Trash2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductsAdminPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
    setLoading(true);
    await deleteProduct(id);
    await fetchProducts();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="title-font" style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package style={{ color: '#e879f9' }} /> إدارة المنتجات
        </h1>
        <Link 
          href={`/${params.locale}/admin/products/new`}
          style={{ backgroundColor: '#c026d3', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'background-color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#a21caf'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#c026d3'}
        >
          <Plus size={20} /> إضافة منتج جديد
        </Link>
      </div>

      <div className="glass-morphism" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader2 className="animate-spin" size={40} style={{ color: '#e879f9' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
            لا توجد منتجات حالياً. أضف منتجك الأول الآن!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }} dir="rtl">
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--foreground-muted)' }}>صورة</th>
                  <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--foreground-muted)' }}>اسم المنتج</th>
                  <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--foreground-muted)' }}>التصنيف</th>
                  <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--foreground-muted)' }}>السعر</th>
                  <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--foreground-muted)' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1rem' }}>
                      {prod.image ? (
                        <img src={prod.image} alt={prod.nameAr} style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-muted)', fontSize: '0.75rem' }}>بدون</div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{prod.nameAr}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#6ee7b7', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}>
                        {prod.category?.nameAr || 'غير محدد'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#e879f9', fontWeight: 'bold' }}>{prod.price.toString()} د.ج</td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleDelete(prod.id)} 
                        style={{ padding: '0.5rem', color: '#fb7185', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(244,63,94,0.2)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="حذف المنتج"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
